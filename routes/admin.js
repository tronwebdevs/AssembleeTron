const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('promise-mysql');
const path = require('path');
const handlebars = require('express-handlebars').create({defaultLayout: 'main'});
const session = require('express-session');
const moment = require('moment');
moment.locale('it');
const fs = require('fs');
const fsPromise = fs.promises;
const PdfPrinter = require('pdfmake');
const credentials = require('../config/credentials.js');
const mysqlCredentials = require('../config/mysql_credentials.js');


// Home page
router.get('/', (req, res) => {
    if (req.session.authenticated == true) {
        res.redirect('/gestore/dashboard');
    } else {
        res.render('admin/home', {
            title: 'Gestore Assemblea - Login',
            error: req.session.authError
        });
    }
});


// Handle login
router.post('/login/', (req, res) => {
    if (req.body.password == credentials.adminPassword) {
        req.session.authenticated = true;
        res.redirect('/gestore/dashboard');
    } else {
        req.session.authError = 'Password errata';
        res.redirect('/gestore/');
    }
});

// Check if authenticated
router.all('*', isAuthenticated);

// DASHBOARD
// Authentication
router.get('/dashboard', (req, res) => {
    // Auth
    if (req.session.authenticated !== true) {
        res.redirect('/gestore/');
    } else {
        mysql.createConnection(mysqlCredentials).then((conn) => {
            let result = conn.query('SELECT * FROM `Info`');
            conn.end();
            return result;
        }).then((rows) => {
            if (rows.length > 0) {
                if (req.session.assembleaAdmin == null) {
                    req.session.assembleaAdmin = {};
                }
                req.session.assembleaAdmin.info = {
                    date: moment(rows[0].ProssimaData).format('YYYY-MM-DD'),
                    startSub: {
                        date: moment(rows[0].AperturaIscrizioni).format('YYYY-MM-DD'),
                        time: moment(rows[0].AperturaIscrizioni).format('HH:mm')
                    },
                    endSub: {
                        date: moment(rows[0].ChiusuraIscrizioni).format('YYYY-MM-DD'),
                        time: moment(rows[0].ChiusuraIscrizioni).format('HH:mm')
                    },
                    display: {
                        date: moment(rows[0].ProssimaData).format('DD/MM/YYYY'),
                        startSub: moment(rows[0].AperturaIscrizioni).format('DD/MM/YYYY - HH:mm'),
                        endSub: moment(rows[0].ChiusuraIscrizioni).format('DD/MM/YYYY - HH:mm'),
                    }
                };
                req.session.assembleaAdmin.info.display.subsClosed = ( moment().diff(moment(req.session.assembleaAdmin.info.endSub.date + 'T' + req.session.assembleaAdmin.info.endSub.time)) > 0 );

                let error = req.session.showErrorToDashboard;
                delete req.session.showErrorToDashboard;

                let success = req.session.showSuccessToDashboard;
                delete req.session.showSuccessToDashboard;

                res.render('admin/dashboard', { title: 'Dashboard', error, success, assemblea: req.session.assembleaAdmin.info.display });
            } else {
                let error = req.session.showErrorToDashboard;
                delete req.session.showErrorToDashboard;

                let success = req.session.showSuccessToDashboard;
                delete req.session.showSuccessToDashboard;

                res.render('admin/dashboard', { title: 'Dashboard', error, success });
            }
        }).catch((error) => {
            res.render('admin/dashboard', { title: 'Dashboard', ferror: error });
        });
    }
});
router.get('/dashboard/assemblea', (req, res) => res.redirect('/gestore/dashboard'));

// Create new assemblea
router.get('/dashboard/assemblea/crea', (req, res) => {
    if (req.session.assembleaAdmin == null) {
        fs.readdir('assemblee', (err, files) => {
            if (err) {
                console.log(err);
                res.render('admin/newassemblea', { title: 'Crea Assemblea', error: err });
            } else {
                let obj;
                if (req.session.loadTemplate != null) {
                    obj = req.session.loadTemplate.assemblea;
                    obj.info.edit = true;
                    obj.templateFiles = {
                        list: files,
                        selected: req.session.loadTemplate.fileName
                    }
                    delete req.session.loadTemplate;
                } else {
                    obj = {
                        info: {
                            startSub: {
                                time: '14:00'
                            },
                            endSub:  {
                                time: '19:00'
                            },
                            edit: true
                        },
                        labs: {
                            labStoreTarget: 'memory'
                        },
                        templateFiles: {
                            list: files
                        },
                        title: 'Crea Assemblea'
                    }
                }
                res.render('admin/newassemblea', obj);
            }
        });
    } else {
        req.session.showErrorToDashboard = 'Prima di creare una nuova assemblea devi eliminare quella corrente';
        res.redirect('/gestore/dashboard');
    }
});
router.post('/dashboard/assemblea/crea/carica', isAuthenticated, (req, res) => {
    if (req.body.templateFile) {
        fs.readFile('assemblee/' + req.body.templateFile, (err, data) => {
            if (err) {
                console.log(err);
                res.redirect('/gestore/dashboard/assemblea/crea');
            } else {
                let pData = JSON.parse(data);
                req.session.newLabs = pData.labs.labsList;
                req.session.loadTemplate = {
                    assemblea: pData,
                    fileName: req.body.templateFile
                }
                res.redirect('/gestore/dashboard/assemblea/crea');
            }
        });
    } else {
        res.redirect('/gestore/dashboard/assemblea/crea');
    }
});
router.post('/dashboard/assemblea/crea', isAuthenticated, (req, res) => {
    // DEBUG
    req.session.nuovaAssemblea = req.body;

    // Crea variabile connessione
    let connection;
    // Variabile laboratori (da sessione)
    let newLabs = req.session.newLabs;

    // Crea connessione e inizia la catena query-then
    mysql.createConnection(mysqlCredentials).then((conn) => {
        // Stabilita la connessione, assegna a variabile globale
        connection = conn;
        // Esegue la prima query, inserisce informazioni nella tabella corrispondente
        return connection.query({
            sql: 'INSERT INTO `Info` (`ProssimaData`, `AperturaIscrizioni`, `ChiusuraIscrizioni`, `Override`) VALUES (?,?,?,0)',
            values: [ req.body.assDate, (req.body.assSubStartDate + ' ' + req.body.assSubStartTime), (req.body.assSubEndDate + ' ' + req.body.assSubEndTime) ]
        });
    }).then(() => {
        // Indice array dei laboratori, incrementa ad ogni chiamata di insertLab(...)
        let labsIndex = 0;
        let classiIndex = 0;
        let classi;

        // Funzione ricorsiva per inserire nel database i le classi
        function insertClasse(classe, resolveSecond, rejectSecond) {
            // Esegue la query per inserire nel database la classe ricevuta come parametro da `insertClasse(...)`
            connection.query({
                sql: 'INSERT INTO `Partecipano` (`SiglaClasse`, `IDProgetto`, `Ora1`, `Ora2`, `Ora3`, `Ora4`) VALUES (?,?,?,?,?,?)',
                values: [
                    classe,
                    newLabs[labsIndex].labID,
                    ( newLabs[labsIndex].labClassiOra1.indexOf(classe) == -1 ? 0 : 1),
                    ( newLabs[labsIndex].labClassiOra2.indexOf(classe) == -1 ? 0 : 1),
                    ( newLabs[labsIndex].labClassiOra3.indexOf(classe) == -1 ? 0 : 1),
                    ( newLabs[labsIndex].labClassiOra4.indexOf(classe) == -1 ? 0 : 1),
                    newLabs[labsIndex].lastsTwoH
                ]
            }).then(() => {
                // Eseguita la query controlla l'indice rispetto al numero totale di classi
                if (classiIndex < (classi.length - 1)) {
                    // Se mancano classi da inserire richiama la funzione, passando il resolve e il reject della Promise secondaria
                    insertClasse(classi[++classiIndex], resolveSecond, rejectSecond);
                } else {
                    // Tutte le classi sono state inserite, chiama la funzione risolutrice della Promise secondaria
                    resolveSecond();
                    return;
                }
            }).catch((error) => {
                // Si è verificato un errore, viene chiamata la funzione di rigetto della Promise secondaria
                if (connection && connection.end) connection.end();
                console.log(error);
                rejectSecond(new Error(error.toString()));
            });
        }

        // Funzione ricorsiva per inserire nel database i laboratori
        function insertLab(lab, resolveMain, rejectMain) {
            // Svuota l'array delle classi
            classi = [];
            // Azzera il contatore per l'array delle classi
            classiIndex = 0;

            // DEBUG
            // console.log(lab);
            // console.log('-------------------');
            // console.log('INDEX: ' + labsIndex);
            // console.log('====================================');

            // Esegue la query per inserire nel database il laboratorio `newLabs[labsIndex]`
            connection.query({
                sql: 'INSERT INTO `Progetti` (`ID`, `Nome`, `Descrizione`, `Aula`, `Ora1`, `Ora2`, `Ora3`, `Ora4`, `DueOre`) VALUES (?,?,?,?,?,?,?,?,?)',
                values: [
                    lab.labID,
                    lab.labName,
                    lab.labDesc,
                    lab.labAula,
                    lab.labPostiOra1,
                    lab.labPostiOra2,
                    lab.labPostiOra3,
                    lab.labPostiOra4,
                    (lab.lastsTwoH ? 1 : 0)
                ]
            }).then(() => {
                // Crea array concatenando tutte le classi di tutte le ore del laboratorio newLabs[labsIndex]
                classi = uniqueArray(lab.labClassiOra1.concat(lab.labClassiOra2, lab.labClassiOra3, lab.labClassiOra4));
                // Crea una seconda Promise per inserire le classi nella tabella Partecipano
                return new Promise((resolve2, reject2) => {
                    // Fa la prima chiamata della funzione per inserire le classi, passando il resolve e il reject della Promise secondaria
                    insertClasse(classi[classiIndex], resolve2, reject2);
                });

            }).then(() => {
                // Eseguita la query controlla l'indice rispetto al numero totale di laboratori
                if (labsIndex < (newLabs.length - 1)) {
                    // Se mancano laboratori da inserire richiama la funzione, passando il resolve e il reject della Promise iniziale
                    insertLab(newLabs[++labsIndex], resolveMain, rejectMain);
                } else {
                    // Tutti i laboratori sono stati inseriti, chiama la funzione risolutrice della Promise iniziale
                    resolveMain();
                    return;
                }
            }).catch((error) => {
                // Si è verificato un errore, viene chiamata la funzione di rigetto della Promise iniziale
                if (connection && connection.end) connection.end();
                console.log(error);
                rejectMain(new Error(error.toString()));
            });
        }

        // Dichiarazione della Promise per inserire tutti i laboratori
        return new Promise((resolve1, reject1) => {
            // Prima chiamata della funzione per inserire i laboratori, passati come parametri funzioni risolutrice e di rigetto
            insertLab(newLabs[labsIndex], resolve1, reject1);
        });
    }).then(() => {
        // Chiude la connessione
        connection.end();

        if (req.body.saveAsTemplateName != null) {
            let assemblea = {
                info: {
                    date: req.body.assDate,
                    startSub: {
                        date: req.body.assSubStartDate,
                        time: req.body.assSubStartTime
                    },
                    endSub: {
                        date: req.body.assSubEndDate,
                        time: req.body.assSubEndTime
                    },
                    display: {
                        date: moment(req.body.assDate).format('DD/MM/YYYY'),
                        startSub: moment(req.body.assSubStartDate + 'T' + req.body.assSubStartTime).format('DD/MM/YYYY - HH:mm'),
                        endSub: moment(req.body.assSubEndDate + 'T' + req.body.assSubEndTime).format('DD/MM/YYYY - HH:mm'),
                    }
                },
                labs: {
                    labsList: newLabs
                }
            }
            let postFileName = req.body.saveAsTemplateName.trim().replace(/ /g, '_');
            delete req.body.saveAsTemplateName;
            let file = 'assemblee/' + ( postFileName == '' ? ('assemblea_' + moment().format('DD-MM-YYYY') ) : postFileName ) + '.json';
            return fsPromise.writeFile(file, JSON.stringify(assemblea, null, 4), 'utf8');
        } else {
            return;
        }
    }).then(() => {
        req.session.showSuccessToDashboard = 'Assemblea creata con successo';
        // Catena conclusa, manda l'utente nella pagina finale segnalando il successo
        res.redirect('/gestore/dashboard/assemblea/crea/fine/successo');
    }).catch((error) => {
        // Errore nella catena, mette in memoria l'errore e manda l'utende nella pagina finale, segnalando un errore
        if (connection && connection.end) connection.end();
        console.error(error);
        req.session.nuovaAssembleaError = error.toString();
        res.redirect('/gestore/dashboard/assemblea/crea/fine/errore');
    });
});
router.get('/dashboard/assemblea/crea/fine/:finalResult', (req, res) => {
    if (req.params.finalResult == 'successo') {
        res.render('admin/assembleaCreated', {
            title: 'Assemblea creata',
            info: req.session.nuovaAssemblea,
            labs: req.session.newLabs
        });
    } else if (req.params.finalResult == 'errore') {
        res.render('admin/assembleaCreated', {
            title: 'Assemblea non creata',
            error: req.session.nuovaAssembleaError,
            info: req.session.nuovaAssemblea,
            labs: req.session.newLabs
        });
    } else {
        res.redirect('/gestore/dashboard/assemblea/crea');
    }
});
router.get('/dashboard/assemblea/elimina', (req, res) => {
    let connection;
    mysql.createConnection(mysqlCredentials).then((conn) => {
        connection = conn;
        let tables = [ 'Info', 'Progetti', 'Partecipano', 'Iscritti' ];
        let promiseArray = [];
        tables.forEach((table) => {
            promiseArray.push(connection.query(`TRUNCATE TABLE ${table}`));
        });
        return Promise.all(promiseArray);
    }).then(() => {
        connection.end();
        delete req.session.assembleaAdmin;
        req.session.showSuccessToDashboard = 'Assemblea eliminata con successo';
        res.redirect('/gestore/dashboard');
    }).catch((error) => {
        if (connection && connection.end) connection.end();
    });
});
router.post('/dashboard/assemblea/pdf', isAuthenticated, (req, res) => {
    let connection;
    mysql.createConnection(mysqlCredentials).then((conn) => {
        connection = conn;
        return connection.query('SELECT `ID` AS `labID`, `Nome` AS `labName` FROM `Progetti`');
    }).then((rows) => {
        let labs = rows;
        let promiseArray = [];
        for (let lab of labs) {
            for (let i = 1; i <= 4; i++) {
                promiseArray.push(connection.query({
                    sql: 'SELECT * FROM `Studenti` WHERE `Matricola` IN (SELECT `MatricolaStudente` FROM `Iscritti` WHERE `Ora' + i + '`=?)',
                    values: [ lab.labID ]
                }));
            }
        }

        return Promise.all(promiseArray);
    }).then((results) => {
        let fonts = {
            Roboto: {
                normal: path.join(__dirname, '..', 'public', '/fonts/Roboto-Regular.ttf'),
                bold: path.join(__dirname, '..', 'public', '/fonts/Roboto-Medium.ttf'),
                italics: path.join(__dirname, '..', 'public', '/fonts/Roboto-Italic.ttf'),
                bolditalics: path.join(__dirname, '..', 'public', '/fonts/Roboto-MediumItalic.ttf')
            }
        };
        let printer = new PdfPrinter(fonts);
        let docDefinition = { content: [] };

        for (let i = 0; i < ( results.length / 4 ); i++) {
            for (let l = 0; l < 4; l++) {
                if (i == 0 && l == 0) {
                    docDefinition.content.push({
                        text: labs[i].labName + ' - ora ' + (l + 1)
                    });
                } else {
                    docDefinition.content.push({
                        text: labs[i].labName + ' - ora ' + (l + 1),
                        pageBreak: 'before'
                    });
                }

                if (results[(i * 4) + l].length == 0) {
                    docDefinition.content.push({
                        text: 'Nessuno studente iscritto a questo laboratorio',
                        alignment: 'center'
                    });
                } else {
                    let students = [];
                    students.push([
                        { text: 'Nome', alignment: 'center' },
                        { text: 'Cognome', alignment: 'center' },
                        { text: 'Classe', alignment: 'center' }
                    ]);
                    for (let student of results[(i * 4) + l]) {
                        students.push([ student.Nome, student.Cognome, student.Classe ]);
                    }
                    docDefinition.content.push({
                        table: {
                            widths: [ '*', '*', 40 ],
                            body: students
                        }
                    });
                }
            }
        }

        let pdfDoc = printer.createPdfKitDocument(docDefinition);
        let file = 'assemblea_' + moment().format('DD-MM-YYYY') + '.pdf';

        let stream = pdfDoc.pipe(fs.createWriteStream(path.join(__dirname, '..', '/pdf/' + file)));
        stream.on('finish', () => {
            req.session.showSuccessToDashboard = 'PDF generato con successo';
            res.download(path.join(__dirname, '..', '/pdf/' + file), file, (err) => {
                if (err) {
                    console.log(err);
                    req.session.showErrorToDashboard = 'Si è verificato un errore nel tentare di scaricare il pdf';
                }
            });
        });
        pdfDoc.end();
    }).catch((error) => {
        req.session.showErrorToDashboard = error.toString();
        res.redirect('/gestore/');
    });
});
router.get('/dashboard/assemblea/salva', (req, res) => {
    let connection;
    mysql.createConnection(mysqlCredentials).then((conn) => {
        connection = conn;
        return connection.query('SELECT `ID` AS `labID`, `Nome` AS `labName`, `Aula` AS `labAula`, `Descrizione` AS `labDesc`, `Ora1` AS `labPostiOra1`, `Ora2` AS `labPostiOra2`, `Ora3` AS `labPostiOra3`, `Ora4` AS `labPostiOra4`, `DueOre` AS `lastsTwoH` FROM `Progetti`');
    }).then((rows) => {
        let labs = rows;
        let promiseArray = [];

        for (let lab of labs) {
            promiseArray.push(connection.query({
                sql: 'SELECT * FROM Partecipano WHERE IDProgetto=?',
                values: [ lab.labID ]
            }));
        }

        return Promise.all(promiseArray);
    }).then((results) => {
        for (let i = 0; i < labs.length; i++) {
            labs[i].labClassiOra1 = results[i].filter((el) => {
                return el.Ora1 === 1;
            }).map((el) => { return el.SiglaClasse });
            labs[i].labClassiOra2 = results[i].filter((el) => {
                return el.Ora1 === 1;
            }).map((el) => { return el.SiglaClasse });
            labs[i].labClassiOra3 = results[i].filter((el) => {
                return el.Ora1 === 1;
            }).map((el) => { return el.SiglaClasse });
            labs[i].labClassiOra4 = results[i].filter((el) => {
                return el.Ora1 === 1;
            }).map((el) => { return el.SiglaClasse });
        }
        assemblea = req.session.assembleaAdmin;
        delete assemblea.info.display.subsClosed;
        assemblea.labs = labs;

        let file = 'assemblee/assemblea_' + moment(assemblea.info.date).format('DD-MM-YYYY') + '.json';
        fs.writeFile(file, JSON.stringify(assemblea, null, 4), 'utf8', (error) => {
            if (error) {
                req.session.showErrorToDashboard = error.toString();
            } else {
                req.session.showSuccessToDashboard = 'Assemblea salvata con successo';
            }
            res.redirect('/gestore/');
        });
    }).catch((error) => {
        req.session.showErrorToDashboard = error.toString();
        res.redirect('/gestore/');
    });
});


// Info page
router.get('/dashboard/assemblea/informazioni', (req, res) => {
    if (req.session.assembleaAdmin.info) {
        let obj = req.session.assembleaAdmin.info;
        obj.title = 'Informazioni';
        res.render('admin/info', obj);
    } else {
        res.redirect('/gestore/dashboard');
    }
});
router.get('/dashboard/assemblea/informazioni/modifica', (req, res) => {
    let infoAssemblea = req.session.assembleaAdmin.info;
    infoAssemblea.edit = true;
    infoAssemblea.title = 'Modifica informazioni'
    if (req.session.infoEdit) {
        if (req.session.infoEdit.code == 200) {
            infoAssemblea.success = req.session.infoEdit.message;
        } else if (req.session.infoEdit.code == 500) {
            infoAssemblea.error = req.session.infoEdit.message;
        }
        delete req.session.infoEdit;
    }
    res.render('admin/info', infoAssemblea);
});
router.post('/dashboard/assemblea/informazioni/modifica', isAuthenticated, (req, res) => {
    if (req.body) {
        mysql.createConnection(mysqlCredentials).then((conn) => {
            let results = conn.query({
                sql: 'UPDATE `Info` SET ProssimaData=?, AperturaIscrizioni=?, ChiusuraIscrizioni=? WHERE 1',
                values: [
                    req.body.assDate,
                    req.body.assSubStartDate + 'T' + req.body.assSubStartTime,
                    req.body.assSubEndDate + 'T' + req.body.assSubEndTime
                ]
            });
            conn.end();
            return
        }).then(() => {
            req.session.assembleaAdmin.info = {
                date: req.body.assDate,
                startSub: {
                    date: req.body.assSubStartDate,
                    time: req.body.assSubStartTime
                },
                endSub: {
                    date: req.body.assSubEndDate,
                    time: req.body.assSubEndTime
                },
                display: {
                    date: moment(req.body.assDate).format('DD/MM/YYYY'),
                    startSub: moment(req.body.assSubStartDate + 'T' + req.body.assSubStartTime).format('DD/MM/YYYY - HH:mm'),
                    endSub: moment(req.body.assSubEndDate + 'T' + req.body.assSubEndTime).format('DD/MM/YYYY - HH:mm'),
                }
            };
            req.session.infoEdit = {
                code: 200,
                message: 'Informazioni modificate con successo'
            }
            res.redirect('/gestore/dashboard/assemblea/informazioni/modifica');
        }).catch((error) => {
            console.log(error);
            req.session.infoEdit = {
                code: 500,
                message: error.toString()
            }
            res.redirect('/gestore/dashboard/assemblea/informazioni/modifica');
        });
    } else {
        res.redirect('/gestore/dashboard/assemblea/informazioni/modifica');
    }
});

// Labs page
router.get('/dashboard/assemblea/laboratori', (req, res) => {
    let connection;
    let rowsProgetti;
    let labsIndex = 0;

    mysql.createConnection(mysqlCredentials).then((conn) => {
        connection = conn;
        return connection.query('SELECT ID AS labID, ' +
                          'Nome AS labName, ' +
                          'Descrizione as labDesc, ' +
                          'Aula AS labAula, ' +
                          'Ora1 AS labPostiOra1, ' +
                          'Ora2 AS labPostiOra2, ' +
                          'Ora3 AS labPostiOra3, ' +
                          'Ora4 AS labPostiOra4, ' +
                          'CASE WHEN DueOre = 1 THEN "Sì" ELSE "No" END AS lastsTwoH ' +
                          'FROM `Progetti`');
    }).then((rows) => {
        rowsProgetti = rows;

        function getClassiLab(labID, resolve, reject) {
            connection.query({
                sql: 'SELECT * FROM `Partecipano` WHERE IDProgetto=?',
                values: [ labID ]
            }).then((rows) => {
                for (let row of rows) {
                    if (row.Ora1 == 1) {
                        if (rowsProgetti[labsIndex].labClassiOra1 == null) {
                            rowsProgetti[labsIndex].labClassiOra1 = [];
                        }
                        rowsProgetti[labsIndex].labClassiOra1.push(row.SiglaClasse);
                    }
                    if (row.Ora2 == 1) {
                        if (rowsProgetti[labsIndex].labClassiOra2 == null) {
                            rowsProgetti[labsIndex].labClassiOra2 = [];
                        }
                        rowsProgetti[labsIndex].labClassiOra2.push(row.SiglaClasse);
                    }
                    if (row.Ora3 == 1) {
                        if (rowsProgetti[labsIndex].labClassiOra3 == null) {
                            rowsProgetti[labsIndex].labClassiOra3 = [];
                        }
                        rowsProgetti[labsIndex].labClassiOra3.push(row.SiglaClasse);
                    }
                    if (row.Ora4 == 1) {
                        if (rowsProgetti[labsIndex].labClassiOra4 == null) {
                            rowsProgetti[labsIndex].labClassiOra4 = [];
                        }
                        rowsProgetti[labsIndex].labClassiOra4.push(row.SiglaClasse);
                    }
                }

                if (labsIndex < (rowsProgetti.length - 1)) {
                    getClassiLab(rowsProgetti[++labsIndex].labID, resolve, reject);
                } else {
                    resolve();
                    return;
                }
            }).catch((error) => {
                if (connection && connection.end) connection.end();
                console.log(error);
                reject(new Error(error.toString()));
            });
        }

        return new Promise((resolve, reject) => {
            getClassiLab(rowsProgetti[labsIndex].labID, resolve, reject);
        });
    }).then(() => {
        connection.end();
        rowsProgetti.forEach(row => {
            row.labClassiOra1 = JSON.stringify(row.labClassiOra1);
            row.labClassiOra2 = JSON.stringify(row.labClassiOra2);
            row.labClassiOra3 = JSON.stringify(row.labClassiOra3);
            row.labClassiOra4 = JSON.stringify(row.labClassiOra4);
        });
        res.render('admin/labs', { title: 'Laboratori', labsList: rowsProgetti });
    }).catch((error) => {
        if (connection && connection.end) connection.end();
        res.render('admin/labs', { title: 'Laboratori', error: error });
    });
});

// Aggiungi laboratorio
router.post('/dashboard/assemblea/laboratori/nuovolab', isAuthenticated, (req, res) => {
    if (req.body.target == 'memory') {
        if (req.session.newLabs == null) {
            req.session.newLabs = [];
        }
        req.session.newLabs.push(req.body.lab);
        res.json({
            result: 200,
            message: ''
        });
    } else {
        let connection;
        let lab = req.body.lab;
        mysql.createConnection(mysqlCredentials).then((conn) => {
            connection = conn;
            return connection.query({
                sql: 'INSERT INTO `Progetti` (`ID`, `Nome`, `Descrizione`, `Aula`, `Ora1`, `Ora2`, `Ora3`, `Ora4`, `DueOre`) VALUES (?,?,?,?,?,?,?,?,?)',
                values: [
                    lab.labID,
                    lab.labName,
                    lab.labDesc,
                    lab.labAula,
                    lab.labPostiOra1,
                    lab.labPostiOra2,
                    lab.labPostiOra3,
                    lab.labPostiOra4,
                    (lab.lastsTwoH ? 1 : 0)
                ]
            });
        }).then(() => {
            let promiseArray = [];
            let classi = uniqueArray(lab.labClassiOra1.concat(lab.labClassiOra2, lab.labClassiOra3, lab.labClassiOra4));

            for (let classe of classi) {
                promiseArray.push(connection.query({
                    sql: 'INSERT INTO `Partecipano` (`SiglaClasse`, `IDProgetto`, `Ora1`, `Ora2`, `Ora3`, `Ora4`) VALUES (?,?,?,?,?,?)',
                    values: [
                        classe,
                        lab.labID,
                        ( lab.labClassiOra1.indexOf(classe) == -1 ? 0 : 1),
                        ( lab.labClassiOra2.indexOf(classe) == -1 ? 0 : 1),
                        ( lab.labClassiOra3.indexOf(classe) == -1 ? 0 : 1),
                        ( lab.labClassiOra4.indexOf(classe) == -1 ? 0 : 1),
                        lab.lastsTwoH
                    ]
                }));
            }

            return Promise.all(promiseArray);
        }).then(() => {
            connection.end();
            res.json({
                result: 200,
                message: 'Laboratorio ' + req.body.lab.labID + ' creato con successo'
            });
        }).catch((error) => {
            if (connection && connection.end) connection.end();
            console.log(error);
            res.json({
                result: 500,
                message: error.toString()
            });
        }).catch((error) => {
            if (connection && connection.end) connection.end();
            console.log(error);
            res.json({
                result: 500,
                message: error.toString()
            });
        });
    }
});
// Modifica laboratorio
router.post('/dashboard/assemblea/laboratori/modificalab', isAuthenticated, (req, res) => {
    if (req.body.target == 'memory') {
        let targetLabIndex;
        req.session.newLabs.forEach((lab, index) => {
            if (lab.labID == req.body.lab.labID) {
                targetLabIndex = index;
            }
        });
        req.session.newLabs[targetLabIndex] = req.body.lab;
        res.json({
            result: 200,
            message: ''
        });
    } else {
        let connection;
        mysql.createConnection(mysqlCredentials).then((conn) => {
            connection = conn;
            return connection.query({
                sql: 'UPDATE `Progetti` SET Nome=?, Descrizione=?, Aula=?, Ora1=?, Ora2=?, Ora3=?, Ora4=?, DueOre=? WHERE ID=?',
                values: [
                    req.body.lab.labName,
                    req.body.lab.labDesc,
                    req.body.lab.labAula,
                    req.body.lab.labPostiOra1,
                    req.body.lab.labPostiOra2,
                    req.body.lab.labPostiOra3,
                    req.body.lab.labPostiOra4,
                    req.body.lab.lastsTwoH,
                    req.body.lab.labID
                ]
            });
        }).then(() => {
            // TODO: aggiotnare/aggiungere classi del laboratorio nella tabella `Partecipano`
            return;
        }).then(() => {
            connection.end();
            res.json({
                result: 200,
                message: 'Laboratorio ' + req.body.lab.labID + ' modificato con successo'
            });
        }).catch((error) => {
            if (connection && connection.end) connection.end();
            console.log(error);
            res.json({
                result: 500,
                message: error.toString()
            });
        })
    }
});
// Elimina laboratorio
router.post('/dashboard/assemblea/laboratori/eliminalab', isAuthenticated, (req, res) => {
    let targetLabIndex;
    if (req.body.target == 'memory') {
        req.session.newLabs.forEach((lab, index) => {
            if (lab.labID == req.body.labID) {
                targetLabIndex = index;
            }
        });
        req.session.newLabs.splice(targetLabIndex, 1);
        res.json({
            result: 200,
            message: ''
        });
    } else {
        let connection;
        mysql.createConnection(mysqlCredentials).then((conn) => {
            connection = conn;
            return connection.query({
                sql: 'DELETE FROM `Progetti` WHERE ID=?',
                values: [ req.body.labID ]
            });
        }).then(() => {
            return connection.query({
                sql: 'DELETE FROM `Partecipano` WHERE IDProgetto=?',
                values: [ req.body.labID ]
            });
        }).then(() => {
            connection.end();
            res.json({
                result: 200,
                message: 'Laboratorio ' + req.body.labID + ' eliminato con successo'
            });
        }).catch((error) => {
            if (connection && connection.end) connection.end();
            console.log(error);
            res.json({
                result: 500,
                message: error.toString()
            });
        });
    }
});

router.get('/dashboard/assemblea/statistiche', async (req, res) => {
    let connection;
    let labList;
    let totalStds;
    let stdsSub;

    mysql.createConnection(mysqlCredentials).then((conn) => {
        connection = conn;
        return connection.query('SELECT ID AS labID, Nome AS labName, `Ora1`+`Ora2`+`Ora3`+`Ora4` AS labPosti FROM `Progetti`');
    }).then((rows) => {
        labList = rows;
        return connection.query('SELECT COUNT(*) AS total FROM `Studenti`');
    }).then((rows) => {
        totalStds = rows[0].total;
        return connection.query('SELECT COUNT(*) AS subs FROM `Iscritti`');
    }).then((rows) => {
        stdsSub = rows[0].subs;

        let promiseList = [];
        for (let lab of labList) {
            for (let i = 1; i <= 4; i++) {
                promiseList.push(connection.query('SELECT COUNT(*) AS subs FROM `Iscritti` WHERE Ora' + i + '=' + lab.labID));
            }
        }
        let labsStats = [];

        return Promise.all(promiseList);
    }).then((results) => {
        let labTotalSubs;
        for (let i = 0; i < (results.length / 4); i++) {
            labTotalSubs = 0;
            for (let l = 0; l < 4; l++) {
                labTotalSubs += results[i + l][0].subs;
            }

            labsStats.push({
                labID: labList[i].labID,
                labName: labList[i].labName,
                labSubs: {
                    total: labList[i].labPosti,
                    now: labTotalSubs,
                    perc: ( (results[i][0].subs * 100) / labList[i].labPosti )
                }
            });
        }
    }).then(() => {
        connection.query('SELECT * FROM `Studenti`').then((rows) => {
            connection.end();
            res.render('admin/stats', {
                subs: {
                    total: totalStds,
                    now: stdsSub,
                    perc: ( (stdsSub * 100) / totalStds )
                },
                labsStats: labsStats,
                students: rows,
                title: 'Statistiche'
            });
        }).catch((error) => {
            if (connection && connection.end) connection.end();
            console.log(error);
            res.render('admin/stats', { title: 'Statistiche', error });
        });
    }).catch((error) => {
        if (connection && connection.end) connection.end();
        res.render('admin/stats', { title: 'Statistiche', error });
    });
});


// Get classi da lista studenti
router.post('/dashboard/assemblea/classi/get', isAuthenticated, (req, res) => {
    mysql.createConnection(mysqlCredentials).then((conn) => {
        let result = conn.query('SELECT DISTINCT `Classe` FROM `Studenti` ORDER BY `Classe`');
        conn.end();
        return result;
    }).then((rows) => {
        res.json({
            result: 200,
            list: rows
        });
    }).catch((error) => {
        res.json({ result: 500, message: 'Si è verificato un errore nel ottenere la lista classi', error: error });
    });
});


// Logout
router.get('/dashboard/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.log(error);
        }
        res.render('admin/logout', { title: 'Logout' });
    });
});



// Errors handling
router.use((err, req, res, next) => {
    if (err.status == 401) {
        res.redirect('/gestore/');
    } else {
        console.log(err.stack);
        res.render('error',  {
            code: 500,
            message: 'Il server ha riscontrato un problema. Contatta il Tronweb per maggiori informazioni.',
            redirect: '/gestore'
        });
    }
});
router.use((req, res) => {
    res.type('text/html').status(404).render('error',  {
        code: 404,
        message: 'La pagina che stai cercando non è stata trovata all\'interno del server.',
        from: '/gestore'
    });
});

// [ ========== FUNCTIONS ========== ]
function isAuthenticated(req, res, next) {
    if (req.session.authenticated === true) {
        next();
    } else {
        let error = new Error('Autenticazione richiesta');
        error.status = 401;
        next(error);
    }
}

// Utils
function checkZero(n) {
    if (n < 10) {
        return "0" + n;
    }
    return n;
}

function uniqueArray(arrArg) {
    return arrArg.filter((elem, pos, arr) => {
        return arr.indexOf(elem) == pos;
    });
}
// [ ===================================== ]

module.exports = router;
