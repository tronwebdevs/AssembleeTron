"use strict"
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const Student = require('./models/Student');
const Sub = require('./models/Sub');
const Lab = require('./models/Lab');
const LabClass = require('./models/LabClass');
const AssemblyInfo = require('./models/AssemblyInfo');

app.set('port', 6000);
app.disable('x-powered-by');
app.use(require('helmet')());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/api/students', require('./routes/students'));
app.use('/api/assembly', require('./routes/assembly'));
app.use('/api/admins', require('./routes/admins'));

app.use((err, req, res, next) => {
    console.error(err);
    if (err.name === "SequelizeConnectionRefusedError") {
        err.message = "Impossibile contattare il DataBase";
    }
    res.status(500).json({
        code: err.code || -1,
        message: err.message,
        token: req.jwtNewToken
    });
});

app.listen(app.get('port'), () => {
   Student.sync()
    .then(() => Sub.sync())
    .then(() => Lab.sync())
    .then(() => LabClass.sync())
    .then(() => AssemblyInfo.sync())
    .then(() => console.log(`SERVER STARTED ON PORT ${app.get('port')}`))
    .catch(error => console.error(error));
});
