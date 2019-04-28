"use strict";
const express = require('express');
const router = express.Router();
const mysql = require('promise-mysql');
const path = require('path');
const moment = require('moment');
moment.locale('it');
const fs = require('fs-extra');
const PdfPrinter = require('pdfmake');

const { mysqlCredentials, adminPassword } = require('../config/config.json');
const assembleeDir = 'assemblee';

// Home
router.get('/', (req, res) => {
    if (req.session.authenticated === true) {
        res.redirect('/gestore/dashboard');
    } else {
        res.render('admin/home', {
            title: 'Gestore Assemblea - Login',
            error: req.session.authError
        });
    }
});


// Login
router.post('/login/', (req, res) => {
    if (req.body.password === adminPassword) {
        req.session.authenticated = true;
        res.redirect('/gestore/dashboard');
    } else {
        req.session.authError = 'Password errata';
        res.redirect('/gestore/');
    }
});

router.all('*', isAuthenticated);

// DASHBOARD
router.get('/dashboard', (req, res) => {
    mysql.createConnection(mysqlCredentials).then((conn) => {
        let result = conn.query('SELECT * FROM `Info`');
        conn.end();
        return result;
    }).then((rows) => {
        if (rows.length > 0) {
            if (!req.session.assembleaAdmin) {
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
});
router.get('/dashboard/assemblea', (req, res) => res.redirect('/gestore/dashboard'));

// New assemblea
router.get('/assemblea/crea', (req, res) => {
    if (!req.session.assembleaAdmin) {
        if (!fs.existsSync(assembleeDir)) {
            fs.mkdirSync(assembleeDir);
        }
        fs.readdir(assembleeDir, (err, files) => {
            if (err) {
                console.log(err);
                res.render('admin/newassemblea', { title: 'Crea Assemblea', error: err });
            } else {
                let assemblea = {};
                if (req.session.loadTemplate) {
                    req.session.newLabs = req.session.loadTemplate.assemblea.labs;

                    assemblea.info = req.session.loadTemplate.assemblea.info;
                    assemblea.info.edit = true;
                    
                    assemblea.labs = {
                        labsList: req.session.loadTemplate.assemblea.labs,
                        labStoreTarget: 'memory'
                    };
                    if (!assemblea.labs.labsList) {
                        assemblea.labs.labsList = [];
                    }
                    assemblea.labs.labsList.map(lab => {
                        for (let i = 1; i <= 4; i++) {
                            lab["labClassiOra" + i] = JSON.stringify(lab["labClassiOra" + i]);
                        }
                        return lab;
                    });

                    assemblea.templateFiles = {
                        list: files,
                        selected: req.session.loadTemplate.fileName
                    };
                    
                    delete req.session.loadTemplate;
                } else {
                    assemblea = {
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
                res.render('admin/newassemblea', assemblea);
            }
        });
    } else {
        req.session.showErrorToDashboard = 'Prima di creare una nuova assemblea devi eliminare quella corrente';
        res.redirect('/gestore/dashboard');
    }
});
router.post('/assemblea/crea/carica', isAuthenticated, (req, res) => {
    if (req.body.templateFile && typeof req.body.templateFile === 'string') {
        fs.readFile(assembleeDir + '/' + req.body.templateFile, (err, data) => {
            if (err) {
                console.log(err);
                res.redirect('/gestore/assemblea/crea');
            } else {
                let pData = JSON.parse(data);
                req.session.newLabs = pData.labs;
                req.session.loadTemplate = {
                    assemblea: pData,
                    fileName: req.body.templateFile
                }
                res.redirect('/gestore/assemblea/crea');
            }
        });
    } else {
        res.redirect('/gestore/assemblea/crea');
    }
});
router.post('/assemblea/crea', isAuthenticated, (req, res) => {
    req.session.nuovaAssemblea = req.body;
    // This fix a BIG bug in express sessions
    req.session.newLabs.map(lab => {
        for (let i = 1; i <= 4; i++) {
            if (lab["labClassiOra" + i].length !== 0) {
                lab["labClassiOra" + i] = JSON.parse(lab["labClassiOra" + i]);
            } else {
                lab["labClassiOra" + i] = [];
            }
        }
        return lab;
    });

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
        let labsPromiseArray = [];
        let classiPromiseArray;
        let classi;

        newLabs.forEach((lab) => {
            labsPromiseArray.push(connection.query({
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
                for (let i = 1; i <= 4; i++) {
                    lab["labClassiOra" + i] = (lab["labClassiOra" + i] || []);
                }
                classi = uniqueArray(lab.labClassiOra1.concat(lab.labClassiOra2, lab.labClassiOra3, lab.labClassiOra4));
                classiPromiseArray = []
                classi.forEach((classe) => {
                    classiPromiseArray.push(connection.query({
                        sql: 'INSERT INTO `Partecipano` (`SiglaClasse`, `IDProgetto`, `Ora1`, `Ora2`, `Ora3`, `Ora4`) VALUES (?,?,?,?,?,?)',
                        values: [
                            classe,
                            lab.labID,
                            ( lab.labClassiOra1.indexOf(classe) === -1 ? 0 : 1),
                            ( lab.labClassiOra2.indexOf(classe) === -1 ? 0 : 1),
                            ( lab.labClassiOra3.indexOf(classe) === -1 ? 0 : 1),
                            ( lab.labClassiOra4.indexOf(classe) === -1 ? 0 : 1)
                        ]
                    }));
                });
                return Promise.all(classi);
            }).catch(err => { throw err; }));
        });

        return Promise.all(labsPromiseArray);
    }).then(() => connection.end()).then(() => {

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
            let file = assembleeDir + '/' + ( postFileName == '' ? ('assemblea_' + moment().format('DD-MM-YYYY') ) : postFileName ) + '.json';
            return fs.writeFile(file, JSON.stringify(assemblea, null, 4), 'utf8');
        }
    }).then(() => {
        req.session.showSuccessToDashboard = 'Assemblea creata con successo';
        // Catena conclusa, manda l'utente nella pagina finale segnalando il successo
        res.redirect('/gestore/assemblea/creata/successo');
    }).catch((error) => {
        // Errore nella catena, mette in memoria l'errore e manda l'utende nella pagina finale, segnalando un errore
        if (connection && connection.end) connection.end();
        console.error(error);
        req.session.nuovaAssembleaError = error.message;
        res.redirect('/gestore/assemblea/creata/errore');
    });
});
router.get('/assemblea/creata/:finalResult', (req, res) => {
    if (req.params.finalResult === 'successo') {
        res.render('admin/assembleaCreated', {
            title: 'Assemblea creata',
            info: req.session.nuovaAssemblea,
            labs: req.session.newLabs
        });
    } else if (req.params.finalResult === 'errore') {
        let connection;
        mysql.createConnection(mysqlCredentials).then((conn) => {
            connection = conn;
            let tables = [ 'Info', 'Progetti', 'Partecipano', 'Iscritti' ];
            let promiseArray = [];
            tables.forEach((table) => {
                promiseArray.push(connection.query(`TRUNCATE TABLE ${table}`));
            });
            return Promise.all(promiseArray);
        }).then(() => connection.end()).then(() => {
            delete req.session.assembleaAdmin;
            res.render('admin/assembleaCreated', {
                title: 'Assemblea non creata',
                error: req.session.nuovaAssembleaError,
                info: req.session.nuovaAssemblea,
                labs: req.session.newLabs
            });
        }).catch((error) => {
            if (connection && connection.end) connection.end();
            console.log(error);
            req.session.showErrorToDashboard = error.message;
            res.redirect('/gestore/');
        });
    } else {
        res.redirect('/gestore/assemblea/crea');
    }
});
router.get('/assemblea/elimina', (req, res) => {
    let connection;
    mysql.createConnection(mysqlCredentials).then((conn) => {
        connection = conn;
        let tables = [ 'Info', 'Progetti', 'Partecipano', 'Iscritti' ];
        let promiseArray = [];
        tables.forEach((table) => {
            promiseArray.push(connection.query(`TRUNCATE TABLE ${table}`));
        });
        return Promise.all(promiseArray);
    }).then(() => connection.end()).then(() => {
        delete req.session.assembleaAdmin;
        req.session.showSuccessToDashboard = 'Assemblea eliminata con successo';
        res.redirect('/gestore/dashboard');
    }).catch((error) => {
        if (connection && connection.end) connection.end();
        console.log(error);
        req.session.showErrorToDashboard = error.message;
        res.redirect('/gestore/');
    });
});
router.post('/assemblea/pdf', isAuthenticated, (req, res) => {
    let connection;
    let labs;
    mysql.createConnection(mysqlCredentials).then((conn) => {
        connection = conn;
        return connection.query('SELECT `ID` AS `labID`, `Nome` AS `labName` FROM `Progetti`');
    }).then((rows) => {
        labs = rows;
        let promiseArray = [];
        labs.forEach((lab) => {
            for (let i = 1; i <= 4; i++) {
                promiseArray.push(connection.query({
                    sql: 'SELECT * FROM `Studenti` WHERE `Matricola` IN (SELECT `MatricolaStudente` FROM `Iscritti` WHERE `Ora' + i + '`=?)',
                    values: [ lab.labID ]
                }));
            }
        })
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
                if (i === 0 && l === 0) {
                    docDefinition.content.push({
                        text: labs[i].labName + ' - ora ' + (l + 1)
                    });
                } else {
                    docDefinition.content.push({
                        text: labs[i].labName + ' - ora ' + (l + 1),
                        pageBreak: 'before'
                    });
                }

                if (results[(i * 4) + l].length === 0) {
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

        if (!fs.existsSync('pdf')){
            fs.mkdirSync('pdf');
        }

        let stream = pdfDoc.pipe(fs.createWriteStream(path.join(__dirname, '..', '/pdf/' + file)));
        stream.on('finish', () => {
            //req.session.showSuccessToDashboard = 'PDF generato con successo'; // Non visualizzato
            res.download(path.join(__dirname, '..', '/pdf/' + file), file, (err) => {
                if (err) {
                    console.log(err);
                    req.session.showErrorToDashboard = 'Si è verificato un errore nel tentare di scaricare il pdf';
                    res.redirect('/gestore/');
                }
            });
        });
        pdfDoc.end();
    }).catch((error) => {
        req.session.showErrorToDashboard = error.message;
        res.redirect('/gestore/');
    });
});
router.get('/assemblea/salva', (req, res) => {
    let connection;
    let labs;
    mysql.createConnection(mysqlCredentials).then((conn) => {
        connection = conn;
        return connection.query('SELECT `ID` AS `labID`, `Nome` AS `labName`, `Aula` AS `labAula`, `Descrizione` AS `labDesc`, `Ora1` AS `labPostiOra1`, `Ora2` AS `labPostiOra2`, `Ora3` AS `labPostiOra3`, `Ora4` AS `labPostiOra4`, `DueOre` AS `lastsTwoH` FROM `Progetti`');
    }).then((rows) => {
        labs = rows
        let promiseArray = [];

        labs.forEach((lab) => {
            promiseArray.push(connection.query({
                sql: 'SELECT * FROM `Partecipano` WHERE `IDProgetto`=?',
                values: [ lab.labID ]
            }));
        });
        return Promise.all(promiseArray);
    }).then((results) => {
        labs.map((lab, index) => {
            for (let i = 1; i <= 4; i++) {
                lab["labClassiOra" + i] = results[index].filter(el => el["Ora" + i] === 1).map(el => el.SiglaClasse);
            }
            return lab;
        });
        let assemblea = req.session.assembleaAdmin;
        delete assemblea.info.display.subsClosed;
        assemblea.labs = labs;

        if (!fs.existsSync(assembleeDir)){
            fs.mkdirSync(assembleeDir);
        }

        let file = assembleeDir + '/assemblea_' + moment(assemblea.info.date).format('DD-MM-YYYY') + '.json';
        fs.writeFile(file, JSON.stringify(assemblea, null, 4), 'utf8', (error) => {
            if (error) {
                req.session.showErrorToDashboard = error.message;
            } else {
                req.session.showSuccessToDashboard = 'Assemblea salvata con successo';
            }
            res.redirect('/gestore/');
        });
    }).catch((error) => {
        req.session.showErrorToDashboard = error.message;
        res.redirect('/gestore/');
    });
});


// Info
router.get('/informazioni', (req, res) => {
    if (req.session.assembleaAdmin.info) {
        let obj = req.session.assembleaAdmin.info;
        obj.title = 'Informazioni';
        res.render('admin/info', obj);
    } else {
        res.redirect('/gestore/dashboard');
    }
});
router.get('/informazioni/modifica', (req, res) => {
    let infoAssemblea = req.session.assembleaAdmin.info;
    infoAssemblea.edit = true;
    infoAssemblea.title = 'Modifica informazioni'
    if (req.session.infoEdit) {
        if (req.session.infoEdit.code === 200) {
            infoAssemblea.success = req.session.infoEdit.message;
        } else if (req.session.infoEdit.code === 500) {
            infoAssemblea.error = req.session.infoEdit.message;
        }
        delete req.session.infoEdit;
    }
    res.render('admin/info', infoAssemblea);
});
router.post('/informazioni/modifica', isAuthenticated, (req, res) => {
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
            return results;
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
            res.redirect('/gestore/informazioni/modifica');
        }).catch((error) => {
            console.log(error);
            req.session.infoEdit = {
                code: 500,
                message: error.message
            }
            res.redirect('/gestore/informazioni/modifica');
        });
    } else {
        res.redirect('/gestore/informazioni/modifica');
    }
});

// Labs
router.get('/laboratori', (req, res) => {
    let connection;
    let labs;

    mysql.createConnection(mysqlCredentials).then((conn) => {
        connection = conn;
        return connection.query('SELECT `ID` AS `labID`, ' +
                          '`Nome` AS `labName`, ' +
                          '`Descrizione` as `labDesc`, ' +
                          '`Aula` AS `labAula`, ' +
                          '`Ora1` AS `labPostiOra1`, ' +
                          '`Ora2` AS `labPostiOra2`, ' +
                          '`Ora3` AS `labPostiOra3`, ' +
                          '`Ora4` AS `labPostiOra4`, ' +
                          'CASE WHEN `DueOre` = 1 THEN "Sì" ELSE "No" END AS `lastsTwoH` ' +
                          'FROM `Progetti`');
    }).then((rows) => {
        labs = rows;
        let promiseArray = [];

        labs.forEach(lab => {
            promiseArray.push(
                connection.query({
                    sql: 'SELECT * FROM `Partecipano` WHERE IDProgetto=?',
                    values: [ lab.labID ]
                }).then((rows) => {
                    for (let row of rows) {
                        for (let i = 1; i <= 4; i++) {
                            if (row["Ora" + i] === 1) {
                                if (!lab["labClassiOra" + i]) {
                                    lab["labClassiOra" + i] = [];
                                }
                                lab["labClassiOra" + i].push(row.SiglaClasse);
                            }
                        }
                    }
                })
            );
        });

        return Promise.all(promiseArray);
    }).then(() => connection.end()).then(() => {
        labs.map(lab => {
            for (let i = 1; i <= 4; i++) {
                if (lab["labClassiOra" + i]) {
                    lab["labClassiOra" + i] = JSON.stringify(lab["labClassiOra" + i]);
                } else {
                    lab["labClassiOra" + i] = "[]";
                }
            }
            return lab;
        });
        res.render('admin/labs', { title: 'Laboratori', labsList: labs });
    }).catch((error) => {
        if (connection && connection.end) connection.end();
        res.render('admin/labs', { title: 'Laboratori', error: error });
    });
});

// Aggiungi laboratorio
router.post('/laboratori/nuovolab', isAuthenticated, (req, res) => {
    if (req.body.target === 'memory') {
        if (!req.session.newLabs) {
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
                    +lab.labID,
                    lab.labName,
                    lab.labDesc,
                    lab.labAula,
                    lab.labPostiOra1,
                    lab.labPostiOra2,
                    lab.labPostiOra3,
                    lab.labPostiOra4,
                    (lab.lastsTwoH === 'true' ? 1 : 0)
                ]
            });
        }).then(() => {
            let promiseArray = [];
            for (let i = 1; i <= 4; i++) {
                lab["labClassiOra" + i] = (JSON.parse(lab["labClassiOra" + i]) || []);
            }
            let classi = uniqueArray(lab.labClassiOra1.concat(lab.labClassiOra2, lab.labClassiOra3, lab.labClassiOra4));
            classi.forEach((classe) => {
                promiseArray.push(connection.query({
                    sql: 'INSERT INTO `Partecipano` (`SiglaClasse`, `IDProgetto`, `Ora1`, `Ora2`, `Ora3`, `Ora4`) VALUES (?,?,?,?,?,?)',
                    values: [
                        classe,
                        lab.labID,
                        ( lab.labClassiOra1.indexOf(classe) === -1 ? 0 : 1),
                        ( lab.labClassiOra2.indexOf(classe) === -1 ? 0 : 1),
                        ( lab.labClassiOra3.indexOf(classe) === -1 ? 0 : 1),
                        ( lab.labClassiOra4.indexOf(classe) === -1 ? 0 : 1),
                        lab.lastsTwoH
                    ]
                }));
            });

            return Promise.all(promiseArray);
        }).then(() => connection.end()).then(() => {
            res.json({
                result: 200,
                message: 'Laboratorio ' + req.body.lab.labID + ' creato con successo'
            });
        }).catch((error) => {
            if (connection && connection.end) connection.end();
            console.log(error);
            res.json({
                result: 500,
                message: error.message
            });
        });
    }
});
// Modifica laboratorio
router.post('/laboratori/modificalab', isAuthenticated, (req, res) => {
    if (req.body.target === 'memory') {
        let targetLabIndex;
        req.session.newLabs.forEach((lab, index) => {
            if (lab.labID === req.body.lab.labID) {
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
        let lab = req.body.lab;
        mysql.createConnection(mysqlCredentials).then((conn) => {
            connection = conn;
            return connection.query({
                sql: 'UPDATE `Progetti` SET Nome=?, Descrizione=?, Aula=?, Ora1=?, Ora2=?, Ora3=?, Ora4=?, DueOre=? WHERE ID=?',
                values: [
                    lab.labName,
                    lab.labDesc,
                    lab.labAula,
                    lab.labPostiOra1,
                    lab.labPostiOra2,
                    lab.labPostiOra3,
                    lab.labPostiOra4,
                    (lab.lastsTwoH === 'true' ? 1 : 0),
                    lab.labID
                ]
            });
        }).then(() => {
            return connection.query({
                sql: 'DELETE FROM `Partecipano` WHERE `IDProgetto`=?',
                values: [ lab.labID ]
            });
        }).then(() => {
            let promiseArray = [];
            for (let i = 1; i <= 4; i++) {
                lab["labClassiOra" + i] = (JSON.parse(lab["labClassiOra" + i]) || []);
            }
            let classi = uniqueArray(lab.labClassiOra1.concat(lab.labClassiOra2, lab.labClassiOra3, lab.labClassiOra4));
            classi.forEach((classe) => {
                promiseArray.push(connection.query({
                    sql: 'INSERT INTO `Partecipano` (`SiglaClasse`, `IDProgetto`, `Ora1`, `Ora2`, `Ora3`, `Ora4`) VALUES (?,?,?,?,?,?)',
                    values: [
                        classe,
                        lab.labID,
                        ( lab.labClassiOra1.indexOf(classe) === -1 ? 0 : 1),
                        ( lab.labClassiOra2.indexOf(classe) === -1 ? 0 : 1),
                        ( lab.labClassiOra3.indexOf(classe) === -1 ? 0 : 1),
                        ( lab.labClassiOra4.indexOf(classe) === -1 ? 0 : 1),
                        lab.lastsTwoH
                    ]
                }));
            });

            return Promise.all(promiseArray);
        }).then(() => connection.end()).then(() => {
            res.json({
                result: 200,
                message: 'Laboratorio ' + req.body.lab.labID + ' modificato con successo'
            });
        }).catch((error) => {
            if (connection && connection.end) connection.end();
            console.log(error);
            res.json({
                result: 500,
                message: error.message
            });
        })
    }
});
// Elimina laboratorio
router.post('/laboratori/eliminalab', isAuthenticated, (req, res) => {
    let targetLabIndex;
    if (req.body.target === 'memory') {
        req.session.newLabs.forEach((lab, index) => {
            if (lab.labID === req.body.labID) {
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
        }).then(() => connection.end()).then(() => {
            res.json({
                result: 200,
                message: 'Laboratorio ' + req.body.labID + ' eliminato con successo'
            });
        }).catch((error) => {
            if (connection && connection.end) connection.end();
            console.log(error);
            res.json({
                result: 500,
                message: error.message
            });
        });
    }
});

router.get('/studenti', (req, res) => {
    let connection;
    let subs;
    let labs;
    
    mysql.createConnection(mysqlCredentials).then((conn) => {
        connection = conn;
        return connection.query('SELECT * FROM `Iscritti`');
    }).then((rows) => {
        subs = rows;
        return connection.query('SELECT * FROM `Progetti`');
    }).then((rows) => {
        let nonPartecipa = { Nome: 'Non partecipa' };
        subs.map(std => {
            for (let i = 1; i <= 4; i++) {
                std["Ora" + i] = (rows.find(lab => lab.ID == std["Ora" + i]) || nonPartecipa).Nome;
            }
            return std;
        });
        return connection.query('SELECT * FROM `Studenti`');
    }).then(() => connection.end()).then((rows) => {
        res.render('admin/students', {
            students: rows,
            subs,
            title: 'Studenti'
        });
    }).catch((error) => {
        if (connection && connection.end) connection.end();
        res.render('admin/students', { title: 'Studenti', error });
    });
});

// Get classi da lista studenti
router.post('/classi/get', isAuthenticated, (req, res) => {
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
            res.send('Si e\' verificato un errore inaspettato!');
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


function isAuthenticated(req, res, next) {
    if (req.session && req.session.authenticated === true) {
        next();
    } else {
        let error = new Error('Autenticazione richiesta');
        error.status = 401;
        next(error);
    }
}

function uniqueArray(arrArg) {
    return arrArg.filter((elem, pos, arr) => {
        return arr.indexOf(elem) == pos;
    });
}

module.exports = router;
