"use strict";
const express = require('express');
const router = express.Router();
const mysql = require('promise-mysql');
const path = require('path');
const uuid = require('uuid/v4');
const moment = require('moment');
moment.locale('it');
const fs = require('fs-extra');
const PdfPrinter = require('pdfmake');
const redis = require('redis');
const client = redis.createClient();

const { mysqlCredentials, adminPassword } = require('../config/config.json');
const assembleeDir = 'assemblee';

router.all('*', checkMessagesToShow);

// Home
router.get('/', (req, res) => {
    if (req.session.authed === true) {
        res.redirect('/gestore/dashboard');
    } else {
        let message = null;
        client.get('admin_' + req.session.id + '_auth_error', (err, msg) => {
            if (err) {
                message = err.message;
            } else {
                if (msg !== null) {
                    message = msg;
                    client.del('admin_' + req.session.id + '_auth_error');
                }
            }
            res.render('admin/home', {
                title: 'Gestore Assemblea - Login',
                error: message
            });
        });
    }
});


// Login
router.post('/login/', (req, res) => {
    if (req.body.password === adminPassword) {
        req.session.authed = true;
        res.redirect('/gestore/dashboard');
    } else {
        client.set('admin_' + req.session.id + '_auth_error', 'Password errata', 'EX', 30);
        res.redirect('/gestore/');
    }
});

router.all('*', isAuthenticated);

// DASHBOARD
router.get('/dashboard', (req, res, next) => {
    const { error, warning, success } = req.show;
    mysql.createConnection(mysqlCredentials).then((conn) => {
        let result = conn.query('SELECT * FROM `Info`');
        conn.end();
        return result;
    }).then((rows) => {
        if (rows.length > 0) {
            const displayInfo = {
                date: moment(rows[0].ProssimaData).format('DD/MM/YYYY'),
                startSub: moment(rows[0].AperturaIscrizioni).format('DD/MM/YYYY - HH:mm'),
                endSub: moment(rows[0].ChiusuraIscrizioni).format('DD/MM/YYYY - HH:mm'),
            };
            client.hmset(
                'assemblea:info',
                'uuid', rows[0].uuid,
                'date', moment(rows[0].ProssimaData).format('YYYY-MM-DD'),
                'startSub', moment(rows[0].AperturaIscrizioni).format(),
                'endSub', moment(rows[0].ChiusuraIscrizioni).format(),
                (err) => {
                    if (err) {
                        if (error) {
                            error += '<br/>' + err.message;
                        } else {
                            error = err.message;
                        }
                    } 
                    if (!rows[0].uuid) {
                        error = 'Identificativo dell\'assemblea non trovato sul database'
                    }

                    res.render('admin/dashboard', {
                        title: 'Dashboard',
                        error, warning, success,
                        assemblea: displayInfo
                    });
                }
            );
        } else {
            res.render('admin/dashboard', {
                title: 'Dashboard',
                error, warning, success
            });
        }
    }).catch((error) => {
        res.render('admin/dashboard', { title: 'Dashboard', ferror: error });
    });
});
router.get('/dashboard/assemblea', (req, res) => res.redirect('/gestore/dashboard'));

// New assemblea
router.get('/assemblea/crea', (req, res, next) => {
    const { error, warning, success } = req.show;
    if (!req.session.assembleaAdmin) {
        if (!fs.existsSync(assembleeDir)) {
            fs.mkdirSync(assembleeDir);
        }
        fs.readdir(assembleeDir, (err, files) => {
            if (err) {
                console.log(err);
                res.render('admin/newassemblea', {
                    title: 'Crea Assemblea',
                    error: err,
                    warning, success
                });
            } else {
                const template = req.session.loadTemplate;
                let assemblea = {};
                if (template) {
                    req.session.newLabs = template.assemblea.labs;

                    assemblea.info = template.assemblea.info;
                    assemblea.info.uuid = uuid();
                    assemblea.info.edit = true;
                    
                    assemblea.labs = {
                        labsList: template.assemblea.labs || [],
                        labStoreTarget: 'memory'
                    };

                    assemblea.labs.labsList.map(lab => {
                        for (let i = 1; i <= 4; i++) {
                            lab["labClassiOra" + i] = JSON.stringify(lab["labClassiOra" + i]);
                        }
                        return lab;
                    });

                    assemblea.templateFiles = {
                        list: files,
                        selected: template.fileName
                    };
                    assemblea.error = error;
                    assemblea.warning = warning;
                    assemblea.success = success;
                    
                    delete req.session.loadTemplate;
                } else {
                    assemblea = {
                        info: {
                            uuid: uuid(),
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
                        title: 'Crea Assemblea',
                        error, warning, success
                    }
                }
                res.render('admin/newassemblea', assemblea);
            }
        });
    } else {
        setMessagesToShow(req.sessionID, { error: 'Prima di creare una nuova assemblea devi eliminare quella corrente' })
        .then(() => res.redirect('/gestore/dashboard'))
        .catch(rerr => next(rerr));
    }
});
router.post('/assemblea/crea/carica', (req, res, next) => {
    if (req.body.templateFile && typeof req.body.templateFile === 'string') {
        fs.readFile(assembleeDir + '/' + req.body.templateFile, (err, data) => {
            if (err) {
                console.error(err);
                setMessagesToShow(req.sessionID, { error: err.message })
                .then(() => res.redirect('/gestore/assemblea/crea'))
                .catch(rerr => next(rerr));
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
router.post('/assemblea/crea', (req, res, next) => {
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
            sql: 'INSERT INTO `Info` (`uuid` ,`ProssimaData`, `AperturaIscrizioni`, `ChiusuraIscrizioni`, `Override`) VALUES (?,?,?,?,0)',
            values: [ req.body.assUUID, req.body.assDate, (req.body.assSubStartDate + ' ' + req.body.assSubStartTime), (req.body.assSubEndDate + ' ' + req.body.assSubEndTime) ]
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
                    +lab.lastsTwoH
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
            }).catch(err => next(err)));
        });

        return Promise.all(labsPromiseArray);
    }).then(() => connection.end()).then(() => {

        if (req.body.saveAsTemplateName != null) {
            let assemblea = {
                info: {
                    uuid: req.body.assUUID,
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
                labs: newLabs
            }
            let postFileName = req.body.saveAsTemplateName.trim().replace(/ /g, '_');
            delete req.body.saveAsTemplateName;
            let file = assembleeDir + '/' + ( postFileName == '' ? ('assemblea_' + moment().format('DD-MM-YYYY') ) : postFileName ) + '.json';
            return fs.writeFile(file, JSON.stringify(assemblea, null, 4), 'utf8');
        }
    }).then(() => {
        setMessagesToShow(req.sessionID, { success: 'Assemblea creata con successo' })
        .then(() => res.redirect('/gestore/assemblea/creata/successo'))
        .catch(rerr => next(rerr));
    }).catch((error) => {
        // Errore nella catena, mette in memoria l'errore e manda l'utende nella pagina finale, segnalando un errore
        if (connection && connection.end) connection.end();
        console.error(error);
        setMessagesToShow(req.sessionID, { error: error.message })
        .then(() => res.redirect('/gestore/assemblea/creata/errore'))
        .catch(rerr => next(rerr));
    });
});
router.get('/assemblea/creata/:finalResult', (req, res, next) => {
    const { error, warning, success } = req.show;
    if (req.params.finalResult === 'successo') {
        res.render('admin/assembleaCreated', {
            title: 'Assemblea creata',
            info: req.session.nuovaAssemblea,
            labs: req.session.newLabs,
            error, warning, success
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
                info: req.session.nuovaAssemblea,
                labs: req.session.newLabs,
                error, warning, success
            });
        }).catch((error) => {
            if (connection && connection.end) connection.end();
            console.error(error);
            setMessagesToShow(req.sessionID, { error: error.message })
            .then(() => res.redirect('/gestore/'))
            .catch(rerr => next(rerr));
        });
    } else {
        res.redirect('/gestore/assemblea/crea');
    }
});
router.get('/assemblea/elimina', (req, res, next) => {
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
        delete req.session.newLabs;
        delete req.session.assembleaAdmin;
        setMessagesToShow(req.sessionID, { success: 'Assemblea eliminata con successo' })
        .then(() => res.redirect('/gestore/dashboard'))
        .catch(rerr => next(rerr));
    }).catch((error) => {
        if (connection && connection.end) connection.end();
        console.error(error);
        setMessagesToShow(req.sessionID, { error: error.message })
        .then(() => res.redirect('/gestore/'))
        .catch(rerr => next(rerr));
    });
});
router.post('/assemblea/pdf', (req, res, next) => {
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
                    console.error(err);
                    setMessagesToShow(req.sessionID, { error: 'Si è verificato un errore nel tentare di scaricare il pdf <br/>' + err.message })
                    .then(() => res.redirect('/gestore/'))
                    .catch(rerr => next(rerr));
                }
            });
        });
        pdfDoc.end();
    }).catch((error) => {
        setMessagesToShow(req.sessionID, { error: error.message })
        .then(() => res.redirect('/gestore/'))
        .catch(rerr => next(rerr));
    });
});
router.get('/assemblea/salva', (req, res, next) => {
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
                setMessagesToShow(req.sessionID, { error: error.message })
                .then(() => res.redirect('/gestore/'))
                .catch(rerr => next(rerr));
            } else {
                setMessagesToShow(req.sessionID, { success: 'Assemblea salvata con successo' })
                .then(() => res.redirect('/gestore/'))
                .catch(rerr => next(rerr));
            }
        });
    }).catch((error) => {
        setMessagesToShow(req.sessionID, { error: error.message })
        .then(() => res.redirect('/gestore/'))
        .catch(rerr => next(rerr));
    });
});


// Info
router.get('/informazioni', (req, res, next) => {
    const { error, warning, success } = req.show;
    client.hgetall('assemblea:info', (err, obj) => {
        if (err) {
            next(err);
        } else {
            if (obj === null) {
                setMessagesToShow(req.sessionID, { error: 'Informazioni dell\'assemblea non trovate' }, 'dashboard')
                .then(() => res.redirect('/gestore/dashboard'))
                .catch(rerr => next(rerr));
            } else {
                res.render('admin/info', {
                    title: 'Informazioni',
                    uuid: obj.uuid,
                    date: obj.date,
                    startSub: {
                        date: moment(obj.startSub).format('YYYY-MM-DD'),
                        time: moment(obj.startSub).format('HH:mm')
                    },
                    endSub: {
                        date: moment(obj.endSub).format('YYYY-MM-DD'),
                        time: moment(obj.endSub).format('HH:mm')
                    },
                    error, warning, success
                });
            }
        }
    });
});
router.get('/informazioni/modifica', (req, res, next) => {
    const { error, warning, success } = req.show;
    client.hgetall('assemblea:info', (err, obj) => {
        if (err) {
            next(err);
        } else {
            if (obj === null) {
                setMessagesToShow(req.sessionID, { error: 'Informazioni dell\'assemblea non trovate' }, 'dashboard')
                .then(() => res.redirect('/gestore/dashboard'))
                .catch(rerr => next(rerr));
            } else {
                res.render('admin/info', {
                    title: 'Modifica Informazioni',
                    uuid: obj.uuid,
                    date: obj.date,
                    startSub: {
                        date: moment(obj.startSub).format('YYYY-MM-DD'),
                        time: moment(obj.startSub).format('HH:mm')
                    },
                    endSub: {
                        date: moment(obj.endSub).format('YYYY-MM-DD'),
                        time: moment(obj.endSub).format('HH:mm')
                    },
                    edit: true,
                    error, success, warning
                });
            }
        }
    });
});
router.post('/informazioni/modifica', (req, res, next) => {
    if (req.body) {
        let newStartSub = moment(req.body.assSubStartDate + ' ' + req.body.assSubStartTime).format();
        let newEndSub = moment(req.body.assSubEndDate + ' ' + req.body.assSubEndTime).format();
        mysql.createConnection(mysqlCredentials).then((conn) => {
            let results = conn.query({
                sql: 'UPDATE `Info` SET ProssimaData=?, AperturaIscrizioni=?, ChiusuraIscrizioni=? WHERE 1',
                values: [
                    req.body.assDate,
                    newStartSub,
                    newEndSub
                ]
            });
            conn.end();
            return results;
        }).then(() => {
            client.hmset(
                'assemblea:info',
                //'uuid', is the same
                'date', req.body.assDate,
                'startSub', newStartSub,
                'endSub', newEndSub,
                () => {
                    setMessagesToShow(req.sessionID, { success: 'Informazioni modificate con successo' })
                    .then(() => res.redirect('/gestore/informazioni'))
                    .catch(rerr => next(rerr));
                }
            );
        }).catch((error) => {
            setMessagesToShow(req.sessionID, { error: error.message })
            .then(() => res.redirect('/gestore/informazioni'))
            .catch(rerr => next(rerr));
        });
    } else {
        res.redirect('/gestore/informazioni/modifica');
    }
});

// Labs
router.get('/laboratori', (req, res, next) => {
    const { error, warning, success } = req.show;
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
                          '`DueOre` AS `lastsTwoH` ' +
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
        res.render('admin/labs', {
            title: 'Laboratori',
            labsList: labs,
            error, warning, success
        });
    }).catch((error) => {
        if (connection && connection.end) connection.end();
        res.render('admin/labs', {
            title: 'Laboratori',
            error: error.message,
            warning, success
        });
    });
});

// Aggiungi laboratorio
router.post('/laboratori/nuovolab', (req, res, next) => {
    if (req.body.target === 'memory') {
        if (!req.session.newLabs) {
            req.session.newLabs = [];
        }
        
        let newLab = parseLab(req.body.lab);
        let labCheckID = req.session.newLabs.findIndex(lab => lab.labID === newLab.labID);

        if (labCheckID !== -1) {
            res.json({
                result: 500,
                message: 'Il nuovo laboratorio ha lo stesso ID del preesistente "' + req.session.newLabs[labCheckID] + '"'
            });
        } else {
            req.session.newLabs.push(newLab);
            res.json({
                result: 200,
                lab: newLab
            });
        }
        
    } else {
        let connection;
        let lab = req.body.lab;
        mysql.createConnection(mysqlCredentials).then(conn => {
            connection = conn;
            return connection.query({
                sql: 'SELECT Nome FROM `Progetti` WHERE `ID`=?',
                values: [ lab.labID ]
            });
        }).then(result => {
            if (result.length === 0) {
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
                        +lab.lastsTwoH
                    ]
                });
            } else if (result.length === 1) {
                throw new Error('Il nuovo laboratorio ha lo stesso ID del preesistente "' + result[0].Nome + '"');
            } else {
                throw new Error('FATALE: Sono stati trovati più laboratori con lo stesso ID');
            }
        }).then(() => {
            let promiseArray = [];
            for (let i = 1; i <= 4; i++) {
                lab["labClassiOra" + i] = (lab["labClassiOra" + i] || []);
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
                        ( lab.labClassiOra4.indexOf(classe) === -1 ? 0 : 1)
                    ]
                }));
            });

            return Promise.all(promiseArray);
        }).then(() => connection.end()).then(() => {
            res.json({
                result: 200,
                lab,
                message: 'Laboratorio ' + req.body.lab.labID + ' creato con successo'
            });
        }).catch((error) => {
            if (connection && connection.end) connection.end();
            console.error(error);
            res.json({
                result: 500,
                message: error.message
            });
        });
    }
});
// Modifica laboratorio
router.post('/laboratori/modificalab', (req, res, next) => {
    if (req.body.target === 'memory') {
        
        let newLab = parseLab(req.body.lab);
        let targetLabIndex = req.session.newLabs.findIndex(lab => lab.labID === newLab.labID);
        if (targetLabIndex >= 0) {
            req.session.newLabs[targetLabIndex] = newLab;

            res.json({
                result: 200,
                lab: newLab
            });
        } else {
            res.json({
                result: 500,
                message: 'Laboratorio non trovato (ID: ' + newLab.labID + ')'
            });
        }

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
                    +lab.lastsTwoH,
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
                lab["labClassiOra" + i] = (lab["labClassiOra" + i] || []);
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
                        ( lab.labClassiOra4.indexOf(classe) === -1 ? 0 : 1)
                    ]
                }));
            });

            return Promise.all(promiseArray);
        }).then(() => connection.end()).then(() => {
            res.json({
                result: 200,
                lab,
                message: 'Laboratorio ' + req.body.lab.labID + ' modificato con successo'
            });
        }).catch((error) => {
            if (connection && connection.end) connection.end();
            console.error(error);
            res.json({
                result: 500,
                message: error.message
            });
        })
    }
});
// Elimina laboratorio
router.post('/laboratori/eliminalab', (req, res, next) => {
    let targetLabIndex;
    if (req.body.target === 'memory') {
        targetLabIndex = req.session.newLabs.findIndex(lab => lab.labID === req.body.labID);
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
            console.error(error);
            res.json({
                result: 500,
                message: error.message
            });
        });
    }
});

router.get('/studenti', (req, res, next) => {
    const { error, warning, success } = req.show;
    let connection;
    let subs;
    let students;
    
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
    }).then(rows => {
        students = rows;
        return connection.end()
    }).then(() => {
        res.render('admin/students', {
            students, subs,
            title: 'Studenti',
            error, warning, success
        });
    }).catch((error) => {
        if (connection && connection.end) connection.end();
        res.render('admin/students', {
            title: 'Studenti',
            error: error.message,
            warning, success
        });
    });
});

// Get classi da lista studenti
router.post('/classi/get', (req, res, next) => {
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
router.get('/dashboard/logout', (req, res, next) => {
    const { error, warning, success } = req.show;
    req.session.destroy(err => {
        if (err) {
            next(err);
        }
        res.render('admin/logout', {
            title: 'Logout',
            error, warning, success
        });
    });
});



// Errors handling
router.use((err, req, res, next) => {
    if (err.status == 401) {
        client.set('admin_' + req.session.id + '_auth_error', err.message, 'EX', 30);
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

function checkMessagesToShow(req, res, next) {
    let target = null;
    if (req.path === '/dashboard') {
        target = 'dashboard';
    };
    getMessagesToShow(req.sessionID, target)
    .then(msg => {
        req.show = msg;
        next();
    })
    .catch(err => next(err));
}

function isAuthenticated(req, res, next) {
    if (req.session && req.session.authed === true) {
        next();
    } else {
        let error = new Error('Autenticazione richiesta');
        error.status = 401;
        next(error);
    }
}

function getMessagesToShow(sessionID, target = 'page') {
    return new Promise((resolve, reject) => {
        client.hgetall('admin:' + sessionID + ':' + target +':show', (err, obj) => {
            if (err) {
                reject(err);
            } else {
                client.hdel('admin:' + sessionID + ':' + target +':show', 'error', 'warning', 'success', (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (obj === null) {
                            resolve({
                                error: null,
                                warning: null,
                                success: null
                            });
                        } else {
                            resolve(obj)
                        }
                    }
                });
            }
        });
    });
}

function setMessagesToShow(sessionID, load, target = 'page') {
    return new Promise((resolve, reject) => {
        let objArray = [ 'admin:' + sessionID + ':' + target + ':show' ];
        if (load !== null) {
            for (let key in load) {
                if (load[key] !== null) {
                    objArray.push(key, load[key]);
                }
            }
            client.hmset(objArray, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        client.expire('admin:' + sessionID + ':' + target +':show', 20, (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    }
                }
            );
        } else {
            reject(new Error('Load cannot be null!'));
        }
    });
}

function uniqueArray(arrArg) {
    return arrArg.filter((elem, pos, arr) => {
        return arr.indexOf(elem) == pos;
    });
}

function parseLab(lab) {
    lab.labID = +lab.labID || -1;
    if ( (+lab.lastsTwoH || 0) === 1) {
        lab.lastsTwoH = true;
    } else {
        lab.lastsTwoH = false;
    }
    for (let i = 1; i <= 4; i++) {
        lab["labPostiOra" + i] = +lab["labPostiOra" + i] || 0;
    }

    return lab;
}

module.exports = router;
