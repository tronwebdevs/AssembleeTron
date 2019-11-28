"use strict";
const express = require('express');
const router = express.Router();
const moment = require('moment');
const fs = require('fs-extra');
const path = require('path');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const Assembly = require('../models/Assembly');
const Laboratory = require('../models/Laboratory');
const Student = require('../models/Student');
const Subscribed = require('../models/Subscribed');

const authUser = require('../utils/AuthUser');
const { isAdmin, isStudent } = require('../utils/CheckUserType');

const { adminPassword } = require('../config');
const assembliesBackup = path.join(__dirname, '../backups');

/**
 * Get assembly info
 * @method get
 * @public
 */
router.get('/info', (req, res, next) =>
    Assembly.find()
        .then(results => {
            if (results.length === 0) {
                throw new Error('Nessuna assemblea in programma');
            } else {
                let assembly = results[0];
                if (moment(assembly.date).diff(moment()) < 0) {
                    error.code = 0;
                    error.message = 'Nessuna assemblea in programma';
                    throw error;
                } else {
                    if (moment(assembly.subscription.open).diff(moment()) > 0) {
                        error.code = 1;
                        error.message = 'La iscrizioni sono attualmente chiuse, torna più tardi';
                        throw error;
                    } else {
                        if (moment(assembly.subscription.close).diff(moment()) > 0) {
                            res.status(200).json({
                                code: 2,
                                info: assembly.toObject()
                            });
                        } else {
                            error.code = 3;
                            error.message = 'La iscrizioni sono terminate';
                            throw error;
                        }
                    }
                }
            }
        })
        .catch(err => next(err))
);

// Filter next routes, requesting the user to be authenticated
router.use('*', authUser);

/**
 * Get assembly general info (admin dashboard)
 * @method get
 * @public
 */
router.get('/', isAdmin, (req, res, next) => {
    
    let labs;
    let students;
    let subs;

    Laboratory.estimatedDocumentCount()
        .then(result => {
            labs = result;
            return Student.estimatedDocumentCount();
        })
        .then(result => {
            students = result;
            return Subscribed.estimatedDocumentCount();
        })
        .then(result => {
            subs = result;
            return Assembly.find();
        })
        .then(results => 
            res.status(200).json({
                code: results.length > 0 ? 1 : 0,
                info: results.length > 0 ? results[0] : null,
                labs,
                students,
                subs,
                token: req.jwtNewToken
            })
        )
        .catch(err => 
            res.status(err.status || 500).json({
                code: err.code !== undefined ? err.code : -1,
                message: err.message,
                labs,
                students,
                token: req.jwtNewToken
            })
        );
});

/**
 * Delete assembly
 * @method post
 * @param {string} password
 * @public
 */
router.delete('/', isAdmin, (req, res, next) => {
    Assembly
        .deleteMany({})
        .then(() => Laboratory.deleteMany({}))
        .then(() => Subscribed.deleteMany({}))
        .then(() => 
            res.status(200).json({ 
                code: 1,
                token: req.jwtNewToken
            })
        )
        .catch(err => next(err));
});

/**
 * Get avabile backups
 * @method get
 * @public
 */
router.get('/backups', isAdmin, (req, res, next) => {
    if (!fs.existsSync(assembliesBackup)){
        fs.mkdirSync(assembliesBackup);
        res.status(200).json({
            code: 1,
            backups: [],
            token: req.jwtNewToken
        });
    } else {
        let files;
        fs.readdir(assembliesBackup)
            .then(result => {
                files = result;
                let promiseArray = [];
                files.forEach(file => promiseArray.push(
                    fs.readFile(
                        path.join(assembliesBackup, file)
                    )
                ));
                return Promise.all(promiseArray);
            })
            .then(results => {
                files = files.map((file, index) => JSON.parse(results[index]));
                res.status(200).json({
                    code: 1,
                    backups: files,
                    token: req.jwtNewToken
                })
            })
            .catch(err => next(err));
    }
});

/**
 * Backup assembly into JSON local file
 * @method post
 * @public
 */
router.post('/backups', isAdmin, (req, res, next) => {
    const { overwrite } = req.body;
    let info;
    Assembly.find()
        .then(results => {
            info = results[0];
            return Laboratory.find();
        })
        .then(labs => {
            if (!fs.existsSync(assembliesBackup)){
                fs.mkdirSync(assembliesBackup);
            }
            const file = path.join(assembliesBackup, info._id + '.json');
            if (fs.existsSync(file) && overwrite !== true) {
                let error = new Error('Il backup di questa assemblea esiste gia\', sovrascriverlo?');
                error.code = 2;
                throw error;
            }

            const assembly = {
                info,
                labs
            };
            
            return fs.writeFile(file, JSON.stringify(assembly, null, 4), 'utf8');
        })
        .then(() => res.status(200).json({
            code: 1,
            message: 'Assemblea salvata con successo',
            token: req.jwtNewToken
        }))
        .catch(err => next(err));
});

/**
 * Load assembly from local backup file
 * @method post
 * @public
 */
router.post('/backups/load', isAdmin, (req, res, next) => {
    const { _id } = req.body;
    if (typeof _id === 'string') {
        const file = path.join(assembliesBackup, _id + '.json');
        let assemblyFile;
        let newAssembly = {};
        fs.readFile(file)
            .then(data => {
                assemblyFile = JSON.parse(data);
                const { info } = assemblyFile;
                return new Assembly(info).save();
            })
            .then(info => {
                newAssembly.info = info;
                let promiseArray = [];
                assemblyFile.labs.forEach(lab => 
                    promiseArray.push(
                        new Laboratory(lab).save()
                    )
                );
                return Promise.all(promiseArray);
            })
            .then(results => {
                newAssembly.labs = results;
                res.status(200).json({
                    code: 1,
                    assembly: newAssembly,
                    token: req.jwtNewToken
                });
            })
            .catch(err => next(err));
    } else {
        next(new Error('Identificativo non valido'));
    }
});

/**
 * Update assembly info
 * @method put
 * @param {object} info
 * @public
 */
router.put('/info', isAdmin, (req, res, next) => {
    const { 
        _id, 
        title, 
        date, 
        subOpen, 
        subClose,
        sections 
    } = req.body.info;

    Assembly.findByIdAndUpdate(_id, {
        title, date,
        subscription: {
            open: moment(subOpen).toDate(),
            close: moment(subClose).toDate()
        },
        sections
    }, { new: true })
        .then(result => {
            if (result) {
                res.status(200).json({
                    code: 1,
                    info: result,
                    token: req.jwtNewToken
                })
            } else {
                throw new Error('Assemblea non trovata (id: ' + _id + ')');
            }
        })
        .catch(err => next(err));
});

/**
 * Create assembly info
 * @method put
 * @param {object} info
 * @public
 */
router.post('/info', isAdmin, (req, res, next) => {
    const { info } = req.body;

    new Assembly(info).save()
        .then(assembly => 
            res.status(200).json({
                code: 1,
                info: assembly,
                token: req.jwtNewToken
            })
        )
        .catch(err => next(err));
});

// TODO: TEST
/**
 * Get assembly laboratories
 * @method get
 * @param {string} action
 * @param {string=} section
 * @public
 */
router.get('/labs', isStudent, (req, res, next) => {
    const { action } = req.query;
    if (action === 'count') {
        Laboratory
            .countDocuments()
            .then(c => 
                res.status(200).json({
                    code: 1,
                    labs: c,
                    token: req.jwtNewToken
                })
            )
            .catch(err => next(err));
    } else if (action === 'getAll') {
        Laboratory.find()
            .then(labs =>
                res.status(200).json({
                    code: 1,
                    labList: labs,
                    token: req.jwtNewToken
                })
            )
            .catch(err => next(err));
    } else {
        next(new Error('Parametri non accettati'));
    }
});

/**
 * Update assembly laboratory
 * @method put
 * @param {object} lab
 * @public
 */
router.put('/labs', isAdmin, (req, res, next) => {
    const { lab } = req.body;
    if (lab) {
        Laboratory.findByIdAndUpdate(lab._id, lab, { new: true })
            .then(result => {
                if (result) {
                    res.status(200).json({
                        code: 1,
                        lab: result,
                        token: req.jwtNewToken
                    });
                } else {
                    throw new Error('Laboratorio non trovato (' + lab._id + ')');
                }
            })
            .catch(err => next(err));
    } else {
        next(new Error('Parametri non accettati'));
    }
});

/**
 * Create assembly laboratory
 * @method post
 * @param {object} lab
 * @public
 */
router.post('/labs', isAdmin, (req, res, next) => {
    const { lab } = req.body;
    lab._id = new ObjectId();
    if (lab) {
        new Laboratory(lab).save()
            .then(newLab => 
                res.status(200).json({
                    code: 1,
                    lab: newLab,
                    token: req.jwtNewToken
                })
            )
            .catch(err => next(err));
    } else {
        next(new Error('Parametri non accettati'));
    }
});

/**
 * Delete assembly laboratory
 * @method delete
 * @param {number} ID
 * @public
 */
router.delete('/labs', isAdmin, (req, res, next) => {
    const { _id } = req.body;
    if (typeof _id === 'string') {
        Laboratory.findByIdAndDelete(_id)
            .then(lab => {
                if (lab) {
                    res.status(200).json({
                        code: 1,
                        labID: lab._id,
                        token: req.jwtNewToken
                    });
                } else {
                    throw new Error('Laboratorio non trovato (' + _id + ')');
                }
            })
            .catch(err => next(err));
    } else {
        next(new Error('Parametri non accettati'));
    }
})

/**
 * Get assembly students
 * @method get
 * @param {string} action
 * @public
 */
router.get('/students', isAdmin, (req, res, next) => {
    const { action } = req.query;
    if (action === 'count') {
        let stdCount;

        Student.estimatedDocumentCount()
            .then(c => {
                stdCount = c;
                return Subscribed.estimatedDocumentCount();
            })
            .then(c => 
                res.status(200).json({
                    code: 1,
                    students: stdCount,
                    subs: c,
                    token: req.jwtNewToken
                })
            )
            .catch(err => next(err));
    } else if (action === 'getAll') {
        let students;
        Student.find()
            .then(results => {
                students = results.map(std => std.toObject());
                return Subscribed.find();
            })
            .then(subs => {
                students = students.map(student => {
                    let sub = subs.find(s => s.studentId === student.studentId) || null;
                    student.labs = sub !== null ? {
                        h1: sub.h1, 
                        h2: sub.h2, 
                        h3: sub.h3, 
                        h4: sub.h4
                    } : null;
                    return student;
                });
                res.status(200).json({
                    code: 1,
                    students,
                    token: req.jwtNewToken
                });
            })
            .catch(err => next(err));
    } else {
        next(new Error('Parametri non accettati'));
    }
});

/* UTILS FUNCTIONS */
/**
 * Get assembly info
 * @param {boolean} forseResponse 
 * @private
 * @deprecated
 */
const getInfo = (forseResponse = false) => ({});

/**
 * Get assembly laboratories
 * @private
 * @deprecated
 */
const getAllLabs = () => ({});

/**
 * Create new laboratory
 * @param {object} lab 
 * @private
 * @deprecated
 */
const createLab = lab => ({});

module.exports = router;