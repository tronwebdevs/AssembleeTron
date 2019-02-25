const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('promise-mysql');
const session = require('express-session');
const moment = require('moment');
moment.locale('it');
const credentials = require('../config/credentials.js');
const mysqlCredentials = require('../config/mysql_credentials.js');

/* CODICI ERRORE LOGIN
 * 502 - Parametro Partecipo/Non errato o inesistente
 * 509 - Errore query sql
 *
 */

/* STUDENT
 * student = {
 *     matricola: 000000x,
 *     name: rows[0].name,
 *     surname: rows[0].surname,
 *     classe: rows[0].classe,
 *     labs: []
 * };
 */


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
            // Seleziona studente in base alla matricola (da tutti gli studenti)
            return connection.query({
                sql: 'SELECT Nome AS name, Cognome AS surname, Classe AS classe FROM `Studenti` WHERE Matricola=?',
                values: [ req.body.matricola ]
            });
        }).then((rows) => {
            // Controlla il numero di righe ottenute (lo studente esiste?)
            if (rows.length == 0) {
                // Matricola inesistente, torna al login
                let error = new Error('La matricola inserita non esiste');
                error.status = 504;
                throw error;
            } else {
                // Studente trovato
                student = {
                    name: rows[0].name,
                    surname: rows[0].surname,
                    classe: rows[0].classe
                };
                // Controlla se e' gia' iscritto all'assemblea
                return connection.query({
                    sql: 'SELECT * FROM `Iscritti` WHERE MatricolaStudente=?',
                    values: [ req.body.matricola ]
                });
            }
        }).then((rows) => {
            if (rows.length == 0) {
                // Studente non e' iscritto all'assemblea
                if (+req.body.part === 1) {
                    // Studente partecipa all'assemblea
                    student.matricola = req.body.matricola;
                    req.session.student = student;
                    res.redirect('/iscrizione');
                } else if (+req.body.part === 0) {
                    // Studente non partecipa all'assemblea
                    connection.query({
                        sql: 'INSERT INTO `Iscritti` (`MatricolaStudente`, `Ora1`, `Ora2`, `Ora3`, `Ora4`) VALUES (?,?,?,?,?)',
                        values: [ req.body.matricola, -1, -1, -1, -1 ]
                    }).then(() => {
                        connection.end();
                        // Salva array laboratori vuoto e studente
                        student.matricola = req.body.matricola;
                        student.labs = [];
                        req.session.student = student;
                        // Va alla pagina di conferma (studente non partecipa)
                        res.redirect('/conferma');
                    }).catch((error) => {
                        // Errore nel registrare lo studente (non partecipa)
                        if (connection && connection.end) connection.end();
                        req.session.authError = {
                            code: 509,
                            message: error.message
                        }
                        res.redirect('/');
                    });
                } else {
                    // Valore inaspettato sul radio di partecipo/non partecipo
                    let error = new Error('Errore inaspettato, codice #SSAD500');
                    error.status = 502;
                    throw error;
                }
            } else if (rows.length == 1) {
                // Studente gia' iscritto all'assemblea
                student.labs = [ rows[0].Ora1, rows[0].Ora2, rows[0].Ora3, rows[0].Ora4 ];
                req.session.student = student;
                res.redirect('/conferma');

                // let error = new Error('La matricola inserita è già iscritta');
                // error.status = 503;
                // throw error;
            }
        }).catch((error) => {
            // Errore nel processo di autenticaione
            if (connection && connection.end) connection.end();
            req.session.authError = {
                code: error.status || 509,
                message: error.message
            }
            res.redirect('/');
        });
    } else {
        // Matricola non fornita (non dovrebbe mai succedere)
        req.session.authError = {
            code: 511,
            message: 'Matricola non inserita'
        }
        res.redirect('/');
    }
});

// Controlla se lo studente e' stato autenticato
router.all('*', isAuthenticated);

router.get('/iscrizione', (req, res) => {
    let connection;
    let classi;
    let labs = { ora1: [], ora2: [], ora3: [], ora4: [] };
    let labList = [];

    mysql.createConnection(mysqlCredentials).then((conn) => {
        connection = conn;
        return connection.query({
            sql: 'SELECT * FROM `Partecipano` WHERE SiglaClasse=? ORDER BY `IDProgetto` ASC',
            values: [ req.session.student.classe ]
        }).then((rows) => {
            classi = rows;
            return connection.query('SELECT `ID` AS `labID`, `Nome` AS `labName`, `Descrizione` AS `labDesc`, `Ora1` AS `labPostiOra1`, `Ora2` AS `labPostiOra2`, `Ora3` AS `labPostiOra3`, `Ora4` AS `labPostiOra4`, `DueOre` AS `lastsTwoH` FROM `Progetti` ORDER BY `ID` ASC');
        }).then((rows) => {
            let promiseArray = [];
            let classe;
            rows.forEach((lab, index) => {
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
            connection.end();
            res.render('students/subscription', { student: req.session.student, labList, labs });
        }).catch((error) => {
            req.session.authError = {
                code: 509,
                message: error.message
            }
            res.redirect('/');
        });
    });
});
router.post('/iscriviti', isAuthenticated, (req, res) => {
    if (req.body.ora1 && req.body.ora2 && req.body.ora3 && req.body.ora4) {
        mysql.createConnection(mysqlCredentials).then((conn) => {
            let result = conn.query({
                sql: 'INSERT INTO `Iscritti` (`MatricolaStudente`, `Ora1`, `Ora2`, `Ora3`, `Ora4`) VALUES (?,?,?,?,?)',
                values: [
                    req.session.student.matricola,
                    req.body.ora1,
                    req.body.ora2,
                    req.body.ora3,
                    req.body.ora4
                ]
            });
    
            req.session.student.labs = [
                req.body.ora1,
                req.body.ora2,
                req.body.ora3,
                req.body.ora4
            ];
            conn.end();
            return result;
        }).then(() => {
            res.redirect('/conferma');
        }).catch((error) => {
            req.session.authError = {
                code: 509,
                message: error.message
            }
            res.redirect('/');
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
        // Laboratori salvati in memoria
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
                            sql: 'SELECT `Nome` AS `labName`, `Aula` AS `labAula` FROM `Progetti` WHERE ID=?',
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
        // Laboratori non salvati in memoria
        res.render('students/confirmSub', { student: [{index: 0, labName: 'req.session.labs vuota', labAula: 'WIP'}] });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            req.session.authError = {
                code: 512,
                message: err.message
            }
        }
        res.redirect('/');
    });
});

// Errore del server
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
// Pagina non trovata
router.use((req, res) => {
    res.type('text/html').status(404).render('error',  {
        code: 404,
        message: 'OOF! Pagina non trovata :(',
        redirect: '/'
    });
});


// [ ========== UTILS FUNZTIONS ========== ]
function isAuthenticated(req, res, next) {
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
