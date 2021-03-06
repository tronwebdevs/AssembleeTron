"use strict"
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Log = require('./models/Log');

mongoose.connect('mongodb://localhost/dissembly', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected successfully to the database'))
.catch(err => {
    console.error('Connection error: ', err)
    process.exit(500);
});

app.set('port', process.argv[2] || 5001);
app.disable('x-powered-by');
app.use(require('helmet')());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/students', require('./routes/students'));
app.use('/api/assembly', require('./routes/assembly'));
app.use('/api/admins', require('./routes/admins'));

app.use((req, res, next) => 
    res.status(404).json({ 
        code: -1, 
        message: 'Pagina non trovata',
        token: req.jwtNewToken
    })
);
app.use((err, req, res, next) => {
    new Log({
        user: req.userID || 'Unknown',
        message: err.message,
        type: 'ERROR'
    }).save()
    .finally(() =>
        res.status(err.status || 500).json({
            code: err.code || -1,
            message: err.message,
            token: req.jwtNewToken
        })
    );
});

app.listen(app.get('port'), () => {
   console.log(`SERVER STARTED ON PORT ${app.get('port')}`);
});
