const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');
const mysqlp = require('promise-mysql');
const handlebars = require('express-handlebars').create({defaultLayout: 'main'});
const session = require('express-session');
const moment = require('moment');
moment.locale('it');
const credentials = require('../credentials.js');
const mysqlCredentials = require('../mysql_credentials.js');

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
        loginPage: true,
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
        // TODO> check error code
        obj.error = req.session.authError.message;
        delete req.session.authError.message;
    }
    res.render('students/home', obj);
});

router.post('/login', (req, res) => {
    let connection;
    let student;

    if (req.body.matricola && req.body.part) {
        mysqlp.createConnection(mysqlCredentials).then((conn) => {
            connection = conn;
            return connection.query({
                sql: 'SELECT Nome AS name, Cognome AS surname, Classe AS classe FROM `Studenti` WHERE Matricola=?',
                values: [ req.body.matricola ]
            });
        }).then((rows) => {
            if (rows.length == 0) {
                connection.end();
                req.session.authError = {
                    code: 504,
                    message: 'La matricola inserita non esiste'
                }
                res.redirect('/');
            } else {
                student = {
                    name: rows[0].name,
                    surname: rows[0].surname,
                    classe: rows[0].classe
                };
                connection.query({
                    sql: 'SELECT * FROM `Iscritti` WHERE MatricolaStudente=?',
                    values: [ req.body.matricola ]
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
                                    message: error.toString()
                                }
                                res.redirect('/');
                            });
                        } else {
                            connection.end();
                            req.session.authError = {
                                code: 502,
                                message: 'Errore inaspettato, codice #SSAD500'
                            }
                            res.redirect('/');
                        }
                    } else {
                        connection.end();
                        req.session.authError = {
                            code: 503,
                            message: 'La matricola inserita è già iscritta'
                        }
                        res.redirect('/');
                    }
                });
            }
        }).catch((error) => {
            if (connection && connection.end) connection.end();
            req.session.authError = {
                code: 509,
                message: error.toString()
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

router.get('/iscrizione', (req, res) => {
    if (req.session.student) {
        let connection;

        mysqlp.createConnection(mysqlCredentials).then((conn) => {
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
    } else {
        req.session.authError = {
            code: 511,
            message: 'Matricola non inserita'
        }
        res.redirect('/');
    }
});

router.post('/iscrizione', (req, res) => {
    if (req.session.student) {
        mysqlp.createConnection(mysqlCredentials).then((conn) => {
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
    } else {
        req.session.authError = {
            code: 511,
            message: 'Matricola non inserita'
        }
        res.redirect('/');
    }
});

router.get('/conferma', (req, res) => {
    if (req.session.student) {
        res.render('students/confirmSub', { student: req.session.student });
    } else {
        req.session.authError = {
            code: 511,
            message: 'Matricola non inserita'
        }
        res.redirect('/');
    }
});


// [ ========== UTILS FUNZTIONS ========== ]
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
};
// [ ===================================== ]

module.exports = router;
