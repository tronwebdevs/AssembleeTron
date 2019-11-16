"use strict"
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tron_assemblies', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => console.log('Connected successfully to the database'));

app.set('port', 5001);
app.disable('x-powered-by');
app.use(require('helmet')());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/students', require('./routes/students'));
app.use('/api/assembly', require('./routes/assembly'));
app.use('/api/admins', require('./routes/admins'));

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
