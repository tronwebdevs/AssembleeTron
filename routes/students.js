"use strict";
const express = require('express');
const router = express.Router();
const mysql = require('promise-mysql');
const moment = require('moment');
moment.locale('it');

const mysqlCredentials = require('../config/mysql_credentials.js');

// Home
router.get('/', (req, res) => {
    if (req.session.student) {
        res.redirect('/conferma');
    } else {
        mysql.createConnection(mysqlCredentials).then((conn) => {
            let result = conn.query('SELECT * FROM `Info` ORDER BY `Override` DESC');
            conn.end();
            return result;
        }).then((rows) => {
            let assemblea;
            if (rows.length == 0) {
                assemblea = { exist: false };
            } else if (rows.length == 1) {
                assemblea = { exist: true, date: moment(rows[0].ProssimaData).format('DD/MM/YYYY') };
                if (moment(rows[0].AperturaIscrizioni).diff(moment()) < 0 && moment(rows[0].ChiusuraIscrizioni).diff(moment()) > 0) {
                    assemblea.subsOpen = true;
                }
                req.session.assemblea = assemblea;
                if (req.session.authError != null) {
                    if (req.session.authError.code == 509) {
                        assemblea.error = 'Errore inaspettato del database';
                        assemblea.consoleError = req.session.authError.message;
                    } else {
                        assemblea.error = req.session.authError.message;
                    }
                    delete req.session.authError;
                }
            } else {
                let error = new Error('Numero di righe inaspettato, considero solo la pima');
                error.status = 504;
                throw error;
            }
            res.render('students/home', assemblea);
        }).catch((error) => {
            if (error.status == 504) {
                error.console = error.message;
                error.message = null;
            }
            res.render('students/home', { error: error.message, consoleError: error.console });
        });
    }
});

// Login
router.post('/login', (req, res) => {
    let connection;
    let student;

    if (req.body.matricola && req.body.part) {
        mysql.createConnection(mysqlCredentials).then((conn) => {
            connection = conn;
            return connection.query({
                sql: 'SELECT `Nome` AS `name`, `Cognome` AS `surname`, `Classe` AS `classe` FROM `Studenti` WHERE `Matricola`=?',
                values: [ req.body.matricola ]
            });
        }).then((rows) => {
            if (rows.length == 0) {
                let error = new Error('La matricola inserita non esiste');
                error.status = 504;
                throw error;
            } else {
                student = {
                    name: rows[0].name,
                    surname: rows[0].surname,
                    classe: rows[0].classe
                };
                return connection.query({
                    sql: 'SELECT * FROM `Iscritti` WHERE `MatricolaStudente`=?',
                    values: [ req.body.matricola ]
                });
            }
        }).then((rows) => {
            if (rows.length == 0) {
                if (+req.body.part === 1) {
                    student.matricola = req.body.matricola;
                    req.session.student = student;
                    res.redirect('/iscrizione');
                } else if (+req.body.part === 0) {
                    connection.query({
                        sql: 'INSERT INTO `Iscritti` (`MatricolaStudente`, `Ora1`, `Ora2`, `Ora3`, `Ora4`) VALUES (?,?,?,?,?)',
                        values: [ req.body.matricola, -1, -1, -1, -1 ]
                    }).then(() => {
                        connection.end();
                        student.matricola = req.body.matricola;
                        student.labs = [];
                        req.session.student = student;
                        res.redirect('/conferma');
                    }).catch((error) => {
                        if (connection && connection.end) connection.end();
                        req.session.authError = {
                            code: 509,
                            message: error.message
                        }
                        res.redirect('/');
                    });
                } else {
                    let error = new Error('Errore inaspettato, codice #SSAD500');
                    error.status = 502;
                    throw error;
                }
            } else if (rows.length == 1) {
                if (rows[0].Ora1 != -1 && rows[0].Ora2 != -1 && rows[0].Ora3 != -1 && rows[0].Ora4 != -1 && +req.body.part === 0) {
                    connection.query({
                        sql: 'UPDATE `Iscritti` SET `Ora1`=?, `Ora2`=?, `Ora3`=?, `Ora4`=? WHERE `MatricolaStudente`=?',
                        values: [ -1, -1, -1, -1, req.body.matricola ]
                    }).then(() => {
                        connection.end();
                        student.matricola = req.body.matricola;
                        student.labs = [];
                        req.session.student = student;
                        res.redirect('/conferma');
                    }).catch((error) => {
                        if (connection && connection.end) connection.end();
                        req.session.authError = {
                            code: 509,
                            message: error.message
                        }
                        res.redirect('/');
                    });
                } else {
                    student.labs = [ rows[0].Ora1, rows[0].Ora2, rows[0].Ora3, rows[0].Ora4 ];
                    req.session.student = student;
                    res.redirect('/conferma');
                }

                // let error = new Error('La matricola inserita è già iscritta');
                // error.status = 503;
                // throw error;
            }
        }).catch((error) => {
            if (connection && connection.end) connection.end();
            req.session.authError = {
                code: error.status || 509,
                message: error.message
            }
            res.redirect('/');
        });
    } else {
        req.session.authError = {
            code: 511,
            message: 'Matricola non inserita'
        }
        res.redirect('/');
    }
});

router.all('*', isLoggedIn);

// Iscrizione studente
router.get('/iscrizione', (req, res) => {
    let connection;
    let classi;
    let labs = { ora1: [], ora2: [], ora3: [], ora4: [] };
    let labList = [];

    mysql.createConnection(mysqlCredentials).then((conn) => {
        connection = conn;
        return connection.query({
            sql: 'SELECT * FROM `Partecipano` WHERE `SiglaClasse`=? ORDER BY `IDProgetto` ASC',
            values: [ req.session.student.classe ]
        }).then((rows) => {
            classi = rows;
            return connection.query('SELECT `ID` AS `labID`, `Nome` AS `labName`, `Descrizione` AS `labDesc`, `Ora1` AS `labPostiOra1`, `Ora2` AS `labPostiOra2`, `Ora3` AS `labPostiOra3`, `Ora4` AS `labPostiOra4`, `DueOre` AS `lastsTwoH` FROM `Progetti` ORDER BY `ID` ASC');
        }).then((rows) => {
            let promiseArray = [];
            let classe;
            rows.forEach((lab) => {
                classe = classi.find((cl) => {
                    return cl.IDProgetto == lab.labID;
                });
                if (classe) {
                    labList.push(lab);
                    promiseArray.push(connection.query({
                        sql: 'SELECT COUNT(*) AS `subs` FROM `Iscritti` WHERE `Ora1`=?',
                        values: [ lab.labID ]
                    }));
                    promiseArray.push(connection.query({
                        sql: 'SELECT COUNT(*) AS `subs` FROM `Iscritti` WHERE `Ora2`=?',
                        values: [ lab.labID ]
                    }));
                    promiseArray.push(connection.query({
                        sql: 'SELECT COUNT(*) AS `subs` FROM `Iscritti` WHERE `Ora3`=?',
                        values: [ lab.labID ]
                    }));
                    promiseArray.push(connection.query({
                        sql: 'SELECT COUNT(*) AS `subs` FROM `Iscritti` WHERE `Ora4`=?',
                        values: [ lab.labID ]
                    }));
                }
            });
            return Promise.all(promiseArray);
        }).then((results) => {
            connection.end();
            labList.forEach((lab, index) => {
                if ( (lab.labPostiOra1 - results[index * 4][0].subs) > 0 && classi[index].Ora1 == 1) {
                    lab.labPostiOra1 -= results[index * 4][0].subs;
                    labs.ora1.push(lab);
                }
                if ( (lab.labPostiOra2 - results[index * 4 + 1][0].subs) > 0 && classi[index].Ora2 == 1) {
                    lab.labPostiOra2 -= results[index * 4 + 1][0].subs;
                    labs.ora2.push(lab);
                }
                if ( (lab.labPostiOra3 - results[index * 4 + 2][0].subs) > 0 && classi[index].Ora3 == 1) {
                    lab.labPostiOra3 -= results[index * 4 + 2][0].subs;
                    labs.ora3.push(lab);
                }
                if ( (lab.labPostiOra4 - results[index * 4 + 3][0].subs) > 0 && classi[index].Ora4 == 1) {
                    lab.labPostiOra4 -= results[index * 4 + 3][0].subs;
                    labs.ora4.push(lab);
                }
            });

            let error = null;
            if (req.session.authError) {
                let errorLabName = labList.find((lab) => lab.labID == req.session.authError.labError.ID).labName;
                error = `Posti esauriti nel laboratorio ${errorLabName} (ora ${req.session.authError.labError.hour})`;
                delete req.session.authError;
            }
            res.render('students/subscription', { student: req.session.student, labList, labs, error });
        }).catch((error) => {
            req.session.authError = {
                code: 509,
                message: error.message
            }
            res.redirect('/');
        });
    });
});
router.post('/iscriviti', isLoggedIn, (req, res) => {
    if (req.body.ora1 && req.body.ora2 && req.body.ora3 && req.body.ora4) {
        let connection;
        let labs;
        let selectedLabs = [ (+req.body.ora1 || -1), (+req.body.ora2 || -1), (+req.body.ora3 || -1),  (+req.body.ora4 || -1)];
        mysql.createConnection(mysqlCredentials).then((conn) => {
            connection = conn;
            let promiseArray = [];
            selectedLabs.forEach((labID) => {
                promiseArray.push(connection.query({
                    sql: 'SELECT `ID`, `Ora1`, `Ora2`, `Ora3`, `Ora4`, `DueOre` FROM `Progetti` WHERE `ID`=?',
                    values: [ labID ]
                }));
            });
            return Promise.all(promiseArray);
        }).then((rows) => {
            labs = rows;
            let promiseArray = [];
            rows.forEach((lab, index) => {
                promiseArray.push(connection.query({
                    sql: 'SELECT COUNT(`Ora' + (index + 1) + '`) AS `subs` FROM `Iscritti` WHERE `Ora' + (index + 1) + '`=?',
                    values: [ lab[0].ID ]
                }));
            });
            return Promise.all(promiseArray);
        }).then((results) => {
            let error = new Error('Posti esauriti per uno dei laboratori scelti');
            error.status = 512;
            let orePostiArray;

            labs.forEach((lab, index) => {
                orePostiArray = Object.values(lab[0]).slice(1);
                if (orePostiArray[index] - results[index][0].subs - 1 < 0) {
                    error.labID = lab[0].ID;
                    error.hour = index + 1;
                    throw error;
                }
            });
            return connection.query({
                sql: 'INSERT INTO `Iscritti` (`MatricolaStudente`, `Ora1`, `Ora2`, `Ora3`, `Ora4`) VALUES (?,?,?,?,?)',
                values: [ req.session.student.matricola ].concat(selectedLabs)
            });
        }).then(() => {
            connection.end();
            req.session.student.labs = selectedLabs;
            res.redirect('/conferma');
        }).catch((error) => {
            if (error.status == 512) {
                req.session.authError = {
                    code: 512,
                    message: error.message,
                    labError: { ID: error.labID, hour: error.hour }
                };
                res.redirect('/iscrizione');
            } else {
                req.session.authError = {
                    code: 509,
                    message: error.message
                };
                res.redirect('/');
            }
        });
    } else {
        req.session.authError = {
            code: 503,
            message: 'Devi riempire tutti i campi!'
        }
        res.redirect('/');
    }
});

// Conferma iscrizione
router.get('/conferma', (req, res) => {
    let connection;
    if (req.session.student.labs) {
        if (typeof req.session.student.labs[0] == 'string' || typeof req.session.student.labs[0] == 'number') {
            if (req.session.student.labs[0] == -1) {
                req.session.student.labs = [];
                res.render('students/confirmSub', { student: req.session.student, assemblea: req.session.assemblea });
            } else {
                mysql.createConnection(mysqlCredentials).then((conn) => {
                    connection = conn;
                    let promiseArray = [];
                    req.session.student.labs.forEach((labID) => {
                        promiseArray.push(connection.query({
                            sql: 'SELECT `Nome` AS `labName`, `Aula` AS `labAula` FROM `Progetti` WHERE `ID`=?',
                            values: [ labID ]
                        }));
                    });
                    return Promise.all(promiseArray);
                }).then((results) => {
                    req.session.student.labs = [];
                    results.forEach((result, index) => {
                        req.session.student.labs.push({
                            index: index + 1,
                            labName: result[0].labName,
                            labAula: result[0].labAula
                        });
                    });
                    res.render('students/confirmSub', { student: req.session.student, assemblea: req.session.assemblea });
                }).catch((error) => {
                    console.log(error);
                    req.session.authError = {
                        code: 509,
                        message: error.message
                    }
                    res.redirect('/');
                });
            }
        } else {
            res.render('students/confirmSub', { student: req.session.student, assemblea: req.session.assemblea });
        }
    } else {
        res.render('students/confirmSub', { student: [{index: 0, labName: 'req.session.labs vuota', labAula: 'WIP'}] });
    }
});

// Logout
router.get('/logout', (req, res) => {
    destroySession(req).then((err) => {
        if (err) {
            req.session.authError = {
                code: 512,
                message: err.message
            }
        }
        res.redirect('/');
    });
});

// Error handling
router.use((err, req, res, next) => {
    if (err.status == 401) {
        res.redirect('/');
    } else {
        destroySession(req).then(() => {
            console.log(err.stack);
            res.render('error',  {
                code: 500,
                message: 'Il server ha riscontrato un problema. Contatta il Tronweb per maggiori informazioni.',
                redirect: '/'
            });
        }).catch((error) => console.log(error));
    }
});
router.use((req, res) => {
    res.type('text/html').status(404).render('error',  {
        code: 404,
        message: 'OOF! Pagina non trovata :(',
        redirect: '/'
    });
});


function isLoggedIn(req, res, next) {
    if (req.session.student) {
        next();
    } else {
        let error = new Error('Matricola non inserita (login)');
        error.status = 401;
        next(error);
    }
}

function destroySession(req) {
    return new Promise((resolve, reject) => {
        if (req.session) {
            req.session.destroy((error) => {
                if (error) {
                    reject(error.message);
                } else {
                    resolve();
                }
            });
        } else {
            resolve();
        }
    });
}

module.exports = router;
