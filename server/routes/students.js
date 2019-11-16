"use strict";
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const moment = require('moment');
const { ObjectId } = mongoose.Types;

const Assembly = require('../models/Assembly');
const Laboratory = require('../models/Laboratory');
const Student = require('../models/Student');
const Subscribed = require('../models/Subscribed');

const authUser = require('../utils/AuthUser');
const { isStudent } = require('../utils/CheckUserType');
const SectionsList = require('../utils/SectionsList');

const { privateKey } = require('../config');

/**
 * Get avabile labs for specific class
 * @method get
 * @param {string} section
 */
router.get('/labs', authUser, isStudent, (req, res, next) => {
    
    const { section } = req.query;

    if (typeof section === 'string') {
        fetchAvabileLabs(section)
            .then(result => 
                res.status(200).json({
                    code: 1,
                    labs: result,
                    token: req.jwtNewToken
                })
            )
            .catch(err => next(err));
    } else {
        next(new Error('Parametri non validi'));
    }
});

/** Authenticate student
 * @method get
 * @param {string} studentID
 * @param {string} part
 */
router.get('/:studentID', (req, res, next) => {
    let fetchStudent;
    const studentID = +req.params.studentID || -1;
    const part = +req.query.part;

    if (studentID && (part === 1 || part === 0)) {
        let studentWasSub = false;

        Student.find({ studentId: studentID })
            .then(students => {
                if (students.length === 1) {
                    fetchStudent = students[0].toObject();
                    return Subscribed.find({ studentId: fetchStudent.studentId });
                } else {
                    let error = new Error('Studente non trovato');
                    error.status = 404;
                    throw error;
                }
            })
            .then(subs => {
                if (subs.length === 1) {
                    studentWasSub = true;
                    let subscribed = subs[0];
                    if (subscribed.h1 !== null && subscribed.h2 !== null && subscribed.h3 !== null && subscribed.h4 !== null && part === 0) {
                        subscribed.h1 = null;
                        subscribed.h2 = null;
                        subscribed.h3 = null;
                        subscribed.h4 = null;
                        subscribed.updatedAt = moment().toDate();
                        return subscribed.save();
                    } else {
                        // let error = new Error('Studente gia\' iscritto');
                        // error.status = 409;
                        // throw error;
                        
                        // View subscribed labs table
                        return subscribed;
                    }
                } else {
                    if (part === 1) {
                        return fetchAvabileLabs(fetchStudent.section);
                    } else if (part === 0) {
                        return new Subscribed({
                            studentId: fetchStudent.studentId,
                            h1: null,
                            h2: null,
                            h3: null,
                            h4: null,
                            createdAt: moment().toDate(),
                            updatedAt: moment().toDate()
                        }).save();
                    }
                }
            })
            .then(results => {
                if (results instanceof Subscribed) {
                    // STUDENTE APPENA DISISCRITTO, `result` E' STUDENTE INSRITTO
                    if (studentWasSub === true) {
                        // LO STUDENTE SI E' DISISCRITTO O E' GIA' ISCRITTO
                        if (results.h1 === null && results.h2 === null && results.h3 === null && results.h4 === null) {
                            // STUDENTE SI E' DISISCRITTO (jwt non necessario)
                            res.status(200).json({
                                code: 3,
                                student: fetchStudent,
                                subscribed: false,
                                wasSubscribed: true,
                                token: null
                            });
                        } else {
                            // res.status(200).json({
                            //     code: 4,
                            //     student,
                            //     labs: [
                            //         results.h1,
                            //         results.h2,
                            //         results.h3,
                            //         results.h4,
                            //     ],
                            //     wasSubscribed: true
                            // });
                            // STUDENTE VUOLE VISUALIZZARE I LABORATORI (jwt non necessario)
                            Laboratory.find({ 
                                $or: [
                                    { _id: ObjectId(results.h1) },
                                    { _id: ObjectId(results.h2) },
                                    { _id: ObjectId(results.h3) },
                                    { _id: ObjectId(results.h4) }
                                ] 
                            })
                                .then(result => {
                                    if (result.length <= 4 && result.length > 0) {
                                        let labs = [ results.h1, results.h2, results.h3, results.h4 ];
                                        labs = labs.map(labID => {
                                            let fLab;
                                            for (let lab of result) {
                                                if (lab._id.equals(labID)) {
                                                    fLab = lab.toObject();
                                                    delete fLab.info;
                                                    return fLab;
                                                }
                                            }
                                            return null;
                                        });
                                        res.status(200).json({
                                            code: 4,
                                            student: fetchStudent,
                                            labs,
                                            subscribed: true,
                                            wasSubscribed: true,
                                            token: null
                                        });
                                    } else {
                                        next(new Error('Errore inaspettato: numero di laboratori inaspettato (' + result.length + ')'));
                                    }
                                })
                                .catch(err => next(err));
                        }
                    } else {
                        // LO STUDENTE NON PARTECIPA ALL'ASSEMBLEA (jwt non necessario)
                        res.status(200).json({
                            code: 2,
                            student: fetchStudent,
                            subscribed: false,
                            wasSubscribed: false,
                            token: null
                        });
                    }
                } else if (results) {
                    // STUDENTE DEVE ISCRIVERSI, `results` E' LA LISTA DEI LABORATORI
                    jwt.sign({
                        id: null,
                        type: 'student'
                    }, privateKey, { expiresIn: 60 * 5 }, (err, token) => {
                        if (err) {
                            next(err);
                        } else {
                            res.status(200).json({
                                code: 1,
                                student: fetchStudent,
                                labs: results,
                                wasSubscribed: false,
                                token
                            });
                        }
                    });
                } else {
                    throw new Error('Risultato inaspettato');
                }
            })
            .catch(err => {
                res.status(err.status || 500).json({
                    code: -1,
                    message: err.message,
                    token: null
                });
            });
    }
});

router.use('*', authUser);

/**
 * Get student's labs
 * @method post
 * @param {string} studentID
 * @param {object} labs
 */
router.post('/:studentID/labs', isStudent, (req, res, next) => {
    const studentID = +req.params.studentID || -1;
    const { h1, h2, h3, h4 } = req.body.labs;
    let labs = [ h1, h2, h3, h4 ];

    if (h1 && h2 && h3 && h4) {
        Subscribed.find({ studentId: studentID })
            .then(subs => {
                if (subs.length > 0) {
                    throw new Error('Sei gia\' iscritto a questa assemblea');
                } else {
                    return Laboratory.find({ 
                        $or: [
                            { _id: ObjectId(h1) },
                            { _id: ObjectId(h2) },
                            { _id: ObjectId(h3) },
                            { _id: ObjectId(h4) }
                        ] 
                    });
                }
            })
            .then(fetchedLabs => {
                labs = labs.map(labID => {
                    let fLab;
                    for (let lab of fetchedLabs) {
                        if (lab._id.toString() === labID.toString()) {
                            fLab = lab.toObject();
                            return fLab;
                        }
                    }
                    return null;
                });
                // "Per i progetti da 2 ore seleziona la prima e la seconda ora o la terza e la quarta ora"
                let error = new Error('Questo laboratori deve essere uguale a quello dell\'ora ');
                error.status = 410;

                let promiseArray = [];
                labs.forEach((lab, index) => {
                    // Check if lasts 2 hours
                    if (lab.two_h === true) {
                        if (index % 2 == 0) {
                            if (!lab._id.equals(labs[index + 1]._id)) {
                                error.message += 'precedente (2H)';
                                error.target = (index + 2);
                                throw error;
                            }
                        } else {
                            if (!lab._id.equals(labs[index - 1]._id)) {
                                error.message += 'successiva (2H)';
                                error.target = index;
                                throw error
                            }
                        }
                    }
        
                    // Count subs to lab
                    promiseArray.push(
                        Subscribed.countDocuments({ ['h' + (index + 1)]: lab._id })
                    );
                });
                return Promise.all(promiseArray);
            })
            .then(results => {
                let error = new Error('Posti esauriti per questo laboratorio');
                error.status = 410;
        
                labs.forEach((lab, index) => {
                    if ( (lab.info['h' + (index + 1)].seats - results[index] - 1 ) < 0) {
                        error.target = (index + i);
                        throw error;
                    }
                });
        
                return new Subscribed({
                    studentId: studentID, 
                    h1, h2, h3, h4,
                    createdAt: moment().toDate(),
                    updatedAt: moment().toDate()
                }).save();
            })
            .then(sub => 
                res.status(200).json({
                    code: 1,
                    labs,
                    token: req.jwtNewToken
                })
            )
            .catch(err => res.status(err.status || 500).json({
                code: -1,
                message: err.message,
                target: err.target || 0,
                token: req.jwtNewToken
            }));
    } else {
        res.status(400).json({
            code: -1,
            message: 'Laboratori nulli',
            target: 0,
            token: req.jwtNewToken
        });
    }
});

/* UTILS FUNCTIONS */
/**
 * Get avabile labs for a specific section
 * @param {String} section
 * @private
 */
const fetchAvabileLabs = section => 
    new Promise((resolve, reject) => {
        let assembly;
        let labs;
        Assembly.find({ active: true })
            .then(results => {
                // Use first assembly ignoring the others actives
                assembly = results[0].toObject();
                return Laboratory.find();
            })
            .then(results => {
                labs = results;
                let promiseArray = [];
                labs = labs.map(lab => {
                    lab = lab.toObject();
                    for (let i = 1; i <= 4; i++) {
                        promiseArray.push(
                            Subscribed.countDocuments({ ['h' + i]: ObjectId(lab._id) })
                        );
                        lab.info['h' + i].sections = SectionsList.parse(lab.info['h' + i].sections, assembly.sections).getList();
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
                });
                resolve(labs);
            })
            .catch(err => reject(err));
    });

module.exports = router;