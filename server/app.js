"use strict"
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');

mongoose.connect('mongodb://localhost/tron_assemblies', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => console.log('Connected successfully to the database'));

const Assembly = require('./models/Assembly');
const Laboratory = require('./models/Laboratory');
const Student = require('./models/Student');
const Subscribed = require('./models/Subscribed');

app.set('port', 5000);
app.disable('x-powered-by');
app.use(require('helmet')());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/test/new', (req, res, next) => {
    let sub = new Subscribed({
        studentId: 17687,
        labs: {
            h1: mongoose.Types.ObjectId('5dcdc3f8c3fb40a06f915d1d'),
            h2: mongoose.Types.ObjectId('5dcdc3f8c3fb40a06f915d1d'),
            h3: mongoose.Types.ObjectId('5dcdc3f8c3fb40a06f915d1d'),
            h4: mongoose.Types.ObjectId('5dcdc3f8c3fb40a06f915d1d'),
        }
    });
    sub.save()
    .then(result => {
        res.status(200).json({ result });
    }).catch(err => res.status(200).json({ err }));
});
app.get('/api/test', (req, res, next) => {
    Assembly.find({ active: true }).then(result => {
        res.status(200).json({ result });
    }).catch(err => res.status(200).json({ err }));
});
// app.use('/api/students', require('./routes/students'));
// app.use('/api/assembly', require('./routes/assembly'));
// app.use('/api/admins', require('./routes/admins'));

app.use((err, req, res, next) => 
    res.status(500).json({
        code: err.code || -1,
        message: err.message,
        token: req.jwtNewToken
    })
);

app.listen(app.get('port'), () => {
   console.log(`SERVER STARTED ON PORT ${app.get('port')}`);
});
