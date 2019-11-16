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

const SectionsList = require('./utils/SectionsList');

app.set('port', 5000);
app.disable('x-powered-by');
app.use(require('helmet')());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/test/newAss', (req, res, next) => {
    let assembly = new Assembly({
        title: 'Assemblea di Prova 2',
        date: moment('2019-11-30'),
        subscription: {
            open: moment().add('4h'),
            close: moment('2019-11-29T18:00:00')
        },
        sections: []
    });

    Student.distinct('section')
        .then(results => {
            results = results.sort();
            assembly.sections = results;
            return assembly.save();
        })
        .then(result => res.status(200).json({ result }))
        .catch(err => res.status(200).json({ err }));
});

app.get('/api/test/new', (req, res, next) => {
    let sub = new Subscribed({
        studentId: 17687,
        h1: mongoose.Types.ObjectId('5dcdc3f8c3fb40a06f915d1d'),
        h2: mongoose.Types.ObjectId('5dcdc3f8c3fb40a06f915d1d'),
        h3: mongoose.Types.ObjectId('5dcdc3f8c3fb40a06f915d1d'),
        h4: mongoose.Types.ObjectId('5dcdc3f8c3fb40a06f915d1d')
    });
    sub.save()
        .then(result => {
            res.status(200).json({ result });
        })
        .catch(err => res.status(200).json({ err }));
});
app.get('/api/test', (req, res, next) => {
    let assembly;
    let labs;
    Assembly.find({ active: true })
        .then(result => {
            assembly = result;
            return Laboratory.find();
        })
        .then(results => {
            labs = results;
            let promiseArray = [];
            labs = labs.map(lab => {
                for (let i = 1; i <= 4; i++) {
                    promiseArray.push(
                        Subscribed.countDocuments({ ['h' + i]: mongoose.Types.ObjectId(lab._id) })
                    );
                    lab.info['h' + i].sections = SectionsList.parse(lab.info['h' + i].sections, assembly[0].sections).getList();
                }
                return lab;
            });
            return Promise.all(promiseArray);
        })
        .then(results => {
            labs = labs.map((lab, index) => {
                for (let i = 1; i <= 4; i++) {
                    lab.info['h' + i].seats -= results[index * 4 + (i - 1)];
                }
                return lab;
            })
            res.status(200).json({
                // assembly,
                labs
            });
        })
        .catch(err => res.status(200).json({ err }));
});

app.get('/api/test/std', (req, res, next) => {
    Subscribed.find()
        .then(results => {
            let check = results[0] instanceof Subscribed;
            res.status(200).json({ results, check})
        })
        .catch(err => next(err));
});

app.use('/api/students', require('./routes/students'));
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
