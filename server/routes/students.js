"use strict";
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const moment = require('moment');
const { ObjectId } = mongoose.Types;

const Laboratory = require('../models/Laboratory');
const Student = require('../models/Student');
const Subscribed = require('../models/Subscribed');

const authUser = require('../utils/AuthUser');
const { isStudent, isAdmin, isSudoer } = require('../utils/CheckUserType');
const { fetchAvabileLabs } = require('../utils/LabsFunctions');

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
                    labs: result
                })
            )
            .catch(err => next(err));
    } else {
        let error = new Error('Parametri non validi');
        error.status = 400;
        next(error);
    }
});

/**
 * Get school's sections
 * @method get
 */
router.get('/sections', authUser, isAdmin, (req, res, next) =>
    Student.distinct('section')
        .then(sections =>
            res.status(200).json({
                code: 1,
                sections
            })
        )
        .catch(err => next(err))
);

/** Authenticate student
 * @method get
 * @param {string} studentID
 * @param {string} part
 */
router.get('/:studentID', (req, res, next) => {
    let fetchStudent;
    const studentId = +req.params.studentID || -1;
    const part = +req.query.part;

    // Check if parameters are valid
    if (studentId !== -1 && (part === 1 || part === 0)) {
        let studentWasSub = false;

        // Fetch student in database
        Student.find({ studentId })
            .then(students => {
                // Check if student has found
                if (students.length === 1) {
                    fetchStudent = students[0].toObject();
                    // Fetch student subscribed
                    return Subscribed.find({ studentId: fetchStudent.studentId });
                } else {
                    let error = new Error('Studente non trovato');
                    error.status = 404;
                    throw error;
                }
            })
            .then(subs => {
                // Check if student is subscribed
                if (subs.length === 1) {
                    studentWasSub = true;
                    let subscribed = subs[0];
                    // Check if the student participate
                    if (subscribed.labs.length !== 0 && part === 0) {
                        // Student participate but wants to unsubscribe
                        subscribed.labs = [];
                        subscribed.updatedAt = moment().toDate();
                        // Save subscribed
                        return subscribed.save();
                    } else {
                        // let error = new Error('Studente gia\' iscritto');
                        // error.status = 409;
                        // throw error;
                        
                        // View subscribed labs table
                        return subscribed;
                    }
                } else {
                    // Student is not subscribed, check if participate
                    if (part === 1) {
                        // Return avabile labs for student
                        return fetchAvabileLabs(fetchStudent.section);
                    } else if (part === 0) {
                        // Student does not participate
                        return new Subscribed({
                            studentId: fetchStudent.studentId,
                            labs: [],
                            createdAt: moment().toDate(),
                            updatedAt: moment().toDate()
                        }).save();
                    }
                }
            })
            .then(results => {
                // Check if student is subscribed
                if (results instanceof Subscribed) {
                    // Check if student was participating
                    if (studentWasSub === true) {
                        // Student is subscribed
                        if (results.labs.length === 0) {
                            // Student unsubscribed (no jwt)
                            res.status(200).json({
                                code: 3,
                                student: fetchStudent,
                                subscribed: false,
                                wasSubscribed: true,
                                token: null
                            });
                        } else {
                            // Student wants to get labs list (no jwt)
                            let fetchLabsQuery = results.labs.map(
                                labID => ({ _id: ObjectId(labID) })
                            )
                            // Fetch labs info for student subscribed labs
                            Laboratory.find({ $or: fetchLabsQuery })
                                .then(fetchedLabs => {
                                    let labs = results.labs;
                                    labs = labs.map(labID => {
                                        let fLab;
                                        for (let lab of fetchedLabs) {
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
                                })
                                .catch(err => next(err));
                        }
                    } else {
                        // Student does not participate (no jwt)
                        res.status(200).json({
                            code: 2,
                            student: fetchStudent,
                            subscribed: false,
                            wasSubscribed: false,
                            token: null
                        });
                    }
                } else if (results) {
                    // Student want to subscribe, `results` is lab list
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

// Next routes require authentication
router.use('*', authUser);

/**
 * Delete subscribed (require sudo)
 * @method delete
 * @param {string} studentID
 */
router.delete('/:studentID', isSudoer, (req, res, next) => {
    const studentId = +req.params.studentID || -1;

    // Check if studentId is valid
    if (studentId !== -1) {
        // Delete student
        Subscribed.deleteOne({ studentId })
            .then(sub => {
                // Check if student has been deleted
                if (sub.deletedCount === 0) {
                    let error = new Error(`Iscritto ${studentId} non trovato`);
                    error.status = 404;
                    throw error;
                } else {
                    res.status(200).json({
                        code: 1,
                        sub
                    });
                }
            })
            .catch(err => next(err));
    } else {
        next(new Error('Matricola non valida'));
    }
});


/**
 * Get student's labs
 * @method post
 * @param {string} studentID
 * @param {object} labs
 */
router.post('/:studentID/labs', isStudent, (req, res, next) => {
    const studentId = +req.params.studentID || -1;
    const { labs } = req.body;

    // Check if parameters are valid
    if (labs.length > 0 && studentId !== -1) {
        let error = new Error();
        // Fetch subscribed
        Subscribed.find({ studentId })
            .then(subs => {
                // Check if subscribed has been found
                if (subs.length > 0) {
                    error.message = 'Sei gia\' iscritto a questa assemblea';
                    error.status = 409;
                    throw error;
                } else {
                    let fetchLabsQuery = labs.map(
                        labID => ({ _id: ObjectId(labID) })
                    )
                    // Fetch subscribed labs
                    return Laboratory.find({ 
                        $or: fetchLabsQuery
                    });
                }
            })
            .then(fetchedLabs => {
                // Map input labs with extra info from fetch
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
                // Prepare error
                error.message = 'Questo laboratorio deve essere uguale a quello dell\'ora ';
                error.status = 400;

                // For each lab check if is valid (two h) and prepare query
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
        
                    // Prepare query to count subs to lab
                    promiseArray.push(
                        Subscribed.countDocuments({ ['labs.' + index]: lab._id })
                    );
                });
                // Execute queries to count subs to labs
                return Promise.all(promiseArray);
            })
            .then(labsSeats => {
                // Prepare error
                error.message = 'Posti esauriti per questo laboratorio';
                error.status = 410;
        
                // For each lab check if seats weren't full
                labs.forEach((lab, index) => {
                    if ( (lab.info[index].seats - labsSeats[index] - 1 ) < 0) {
                        error.target = (index + 1);
                        throw error;
                    }
                });
        
                // Insert new subscribed into database
                return new Subscribed({
                    studentId, labs,
                    createdAt: moment().toDate(),
                    updatedAt: moment().toDate()
                }).save();
            })
            .then(sub => 
                res.status(200).json({
                    code: 1,
                    labs
                })
            )
            .catch(err => 
                res.status(err.status || 500).json({
                    code: -1,
                    message: err.message,
                    target: err.target || 0
                })
            );
    } else {
        let error = new Error('Parametri non validi');
        error.status = 400;
        next(error);
    }
});

/**
 * Create new student (require sudo)
 * @method post
 * @param {string} studentID
 */
router.post('/:studentID/create', isSudoer, (req, res, next) => {
    const studentId = +req.params.studentID || -1;
    const { name, surname, section } = req.body;

    // Check if parameters are valid
    if (
        studentId !== -1 && 
        typeof name === 'string' && 
        typeof surname === 'string' && 
        typeof section === 'string'
    ) {
        // Create new student and inserti into database
        new Student({
            studentId, name, 
            surname, section
        }).save()
            .then(student => 
                res.status(200).json({
                    code: 1,
                    student
                })
            )
            .catch(err => next(err));
    } else {
        let error = new Error('Parametri non validi');
        error.status = 400;
        next(error);
    }
});

module.exports = router;