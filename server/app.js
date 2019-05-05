const express = require('express');
const app = express();
const mysql = require('promise-mysql');

const { mysql_creds } = require('./config.json');

app.use(require('helmet')());
app.use(require('body-parser').urlencoded({ extended: true }));

app.post('/api/login', (req, res, next) => {
    let connection;
    let student;
    
    if ((+req.body.matricola || 0) && (+req.body.part === 1 || +req.body.part === 0)) {
        mysql.createConnection(mysql_creds).then((conn) => {
            connection = conn;
            return connection.query({
                sql: 'SELECT `Nome` AS `name`, `Cognome` AS `surname`, `Classe` AS `classe` FROM `Studenti` WHERE `Matricola`=?',
                values: [ req.body.matricola ]
            });
        }).then((rows) => {
            if (rows.length === 0) {
                let error = new Error('La matricola inserita non esiste');
                error.status = 504;
                throw error;
            } else if (rows.length === 1) {
                student = {
                    name: rows[0].name,
                    surname: rows[0].surname,
                    classe: rows[0].classe
                };
                return connection.query({
                    sql: 'SELECT * FROM `Iscritti` WHERE `MatricolaStudente`=?',
                    values: [ req.body.matricola ]
                });
            } else {
                let error = new Error('Sono state trovate 2 matricole uguali');
                error.status = 409;
                throw error;
            }
        }).then((rows) => {
            if (rows.length === 0) {
                if (+req.body.part === 1) {
                    student.matricola = req.body.matricola;
                    res.status(200).json({ matricola: 200, redirect: '/iscrizione' });
                } else {
                    connection.query({
                        sql: 'INSERT INTO `Iscritti` (`MatricolaStudente`, `Ora1`, `Ora2`, `Ora3`, `Ora4`) VALUES (?,?,?,?,?)',
                        values: [ req.body.matricola, -1, -1, -1, -1 ]
                    }).then(() => {
                        connection.end();
                        student.matricola = req.body.matricola;
                        student.labs = [];
                        res.status(200).json({ message: 'OK', student });
                    }).catch((error) => {
                        next(error);
                    });
                }
            } else if (rows.length === 1) {
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
                        next(error);
                    });
                } else {
                    student.labs = [ rows[0].Ora1, rows[0].Ora2, rows[0].Ora3, rows[0].Ora4 ];
                    res.status(200).json({ message: 'OK', student });
                }

                // let error = new Error('La matricola inserita è già iscritta');
                // error.status = 503;
                // throw error;
            } else {
                let error = new Error('Iscritto doppio');
                error.status = 409;
                throw error;
            }
        }).catch((error) => {
            next(error);
        });
    } else {
        next(new Error('Matricola non inserita'));
    }

});

app.use((err, req, res, next) => {
    res.status(500).json({ message: error.message });
});

app.listen(5000, () => console.log('SERVER STARTED ON PORT 5000'));