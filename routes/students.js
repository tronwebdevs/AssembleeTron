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
    let obj = {
        subsOpen: true,
        assemblea: {
            info: {
                display: {
                    date: '06/02/2019'
                }
            }
        }
    };
    if (req.session.authError != null) {
        if (req.session.authError.code == 509) {
            obj.error = 'Errore inaspettato del database';
            obj.consoleError = req.session.authError.message;
        } else {
            obj.error = req.session.authError.message;
        }
        delete req.session.authError;
    }
    res.render('students/home', obj);
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
                connection.end();
                req.session.authError = {
                    code: 504,
                    message: 'La matricola inserita non esiste'
                }
                res.redirect('/');
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
                    }).catch(() => {
                        // Errore nel registrare lo studente (non partecipa)
                        if (connection && connection.end) connection.end();
                        req.session.authError = {
                            code: 509,
                            message: error.toString()
                        }
                        res.redirect('/');
                    });
                } else {
                    // Valore inaspettato sul radio di partecipo/non partecipo
                    connection.end();
                    req.session.authError = {
                        code: 502,
                        message: 'Errore inaspettato, codice #SSAD500'
                    }
                    res.redirect('/');
                }
            } else {
                // Studente gia' iscritto all'assemblea
                connection.end();
                req.session.authError = {
                    code: 503,
                    message: 'La matricola inserita è già iscritta'
                }
                res.redirect('/');
            }
        }).catch((error) => {
            // Errore nel processo di autenticaione
            if (connection && connection.end) connection.end();
            req.session.authError = {
                code: 509,
                message: error.toString()
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
    
    mysql.createConnection(mysqlCredentials).then((conn) => {
        connection = conn;
        return connection.query({
            sql: 'SELECT * FROM `Partecipano` WHERE SiglaClasse=?',
            values: [ req.session.student.classe ]
        }).then((rows) => {
            let labs = [[], [], [], []];

            for (let row of rows) {
                if (row.Ora1 == 1) {
                    labs[0].push(row.IDProgetto);
                }
                if (row.Ora2 == 1) {
                    labs[1].push(row.IDProgetto);
                }
                if (row.Ora3 == 1) {
                    labs[2].push(row.IDProgetto);
                }
                if (row.Ora4 == 1) {
                    labs[3].push(row.IDProgetto);
                }
            }

            let labList = uniqueArray(labs[0].concat(labs[1], labs[2], labs[3]));

            for (let lab of labList) {

            }

            connection.end();
            console.log(rows);
            res.render('students/subscription', { student: req.session.student });
        }).catch((error) => {
            req.session.authError = {
                code: 509,
                message: error.toString()
            }
            res.redirect('/');
        });
    });
});
router.post('/iscriviti', isAuthenticated, (req, res) => {
    mysql.createConnection(mysqlCredentials).then((conn) => {
        let result = conn.query({
            sql: 'INSERT INTO `Iscritti` (`MatricolaStudente`, `Ora1`, `Ora2`, `Ora3`, `Ora4`) VALUES (?,?,?,?,?)',
            values: [
                req.session.student.matricola,
                req.session.student.labs[0].labID,
                req.session.student.labs[1].labID,
                req.session.student.labs[2].labID,
                req.session.student.labs[3].labID
            ]
        });
        conn.end();
        return result;
    }).then(() => {
        res.redirect('/conferma');
    }).catch((error) => {
        req.session.authError = {
            code: 509,
            message: error.toString()
        }
        res.redirect('/');
    });
});

// Conferma iscrizione
router.get('/conferma', (req, res) => {
    res.render('students/confirmSub', { student: req.session.student });
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
        message: 'La pagina che stai cercando non è stata trovata all\'interno del server.',
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
                    reject(error.toString());
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
