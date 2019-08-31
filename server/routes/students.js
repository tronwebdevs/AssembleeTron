"use strict";
const express = require('express');
const router = express.Router();
const Sequleize = require('sequelize');
const { Op } = Sequleize;
const jwt = require('jsonwebtoken');

const Student = require('../models/Student');
const Sub = require('../models/Sub');
const Lab = require('../models/Lab');
const LabClass = require('../models/LabClass');

const authUser = require('../utils/AuthUser');
const { isStudent } = require('../utils/CheckUserType');

const { privateKey } = require('../config');

/**
 * Get avabile labs for specific class
 * @method get
 * @param {string} classLabel
 */
router.get('/labs', authUser, isStudent, (req, res, next) => {
    
    const { classLabel } = req.query;

    if (typeof classLabel === 'string') {
        fetchAvabileLabs(classLabel).then(result => {
            res.status(200).json({
                code: 1,
                labs: result.labList,
                token: req.jwtNewToken
            });
        }).catch(err => next(err));
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
    let student;
    const studentID = +req.params.studentID || -1;
    const part = +req.query.part;

    if (studentID && (part === 1 || part === 0)) {
        let sutudenWasSub = false;

        Student.findOne({
            where: {
                ID: studentID
            }
        })
        .then(std => {
            if (std) {
                student = {
                    ID: std.ID,
                    name: std.name,
                    surname: std.surname,
                    classLabel: std.classLabel
                };
                return Sub.findOne({
                    where: {
                        ID: std.ID
                    }
                });
            } else {
                let error = new Error('Studente non trovato');
                error.status = 404;
                throw error;
            }
        })
        .then(sub => {
            if (sub) {
                sutudenWasSub = true;
                if (sub.h1 !== -1 && sub.h2 !== -1 && sub.h3 !== -1 && sub.h4 !== -1 && part === 0) {
                    return sub.update({
                        h1: -1,
                        h2: -1,
                        h3: -1,
                        h4: -1
                    });
                } else {
                    // let error = new Error('Studente gia\' iscritto');
                    // error.status = 409;
                    // throw error;
                    return new Promise(resolve => resolve(sub));
                }
            } else {
                if (part === 1) {
                    return fetchAvabileLabs(student.classLabel);
                } else if (part === 0) {
                    return Sub.create({
                        ID: student.ID,
                        h1: -1,
                        h2: -1,
                        h3: -1,
                        h4: -1
                    });
                }
            }
        })
        .then(results => {
            if (results instanceof Sub) {
                // STUDENTE APPENA DISISCRITTO, `result` E' STUDENTE INSRITTO
                if (sutudenWasSub === true) {
                    // LO STUDENTE SI E' DISISCRITTO O E' GIA' ISCRITTO
                    if (results.h1 === -1 && results.h2 === -1 && results.h3 === -1 && results.h4 === -1) {
                        // STUDENTE SI E' DISISCRITTO (jwt non necessario)
                        res.status(200).json({
                            code: 3,
                            student,
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
                        Lab.findAndCountAll({
                            where: {
                                ID: [ results.h1, results.h2, results.h3, results.h4 ]
                            }
                        }).then(result => {
                            if (result.count <= 4 || result.count > 0) {
                                let labs = [ results.h1, results.h2, results.h3, results.h4 ];
                                labs = labs.map(labID => result.rows.find(lab => lab.ID === labID));
                                res.status(200).json({
                                    code: 4,
                                    student,
                                    labs,
                                    subscribed: true,
                                    wasSubscribed: true,
                                    token: null
                                });
                            } else {
                                next(new Error('Errore inaspettato: numero di laboratori inaspettato (' + result.count + ')'));
                            }
                        }).catch(err => next(err));
                    }
                } else {
                    // LO STUDENTE NON PARTECIPA ALL'ASSEMBLEA (jwt non necessario)
                    res.status(200).json({
                        code: 2,
                        student,
                        subscribed: false,
                        wasSubscribed: false,
                        token: null
                    });
                }
            } else if (results.labList) {
                // STUDENTE DEVE ISCRIVERSI, `results.labList` E' LA LISTA DEI LABORATORI
                jwt.sign({
                    id: null,
                    type: 'student'
                }, privateKey, { expiresIn: 60 * 5 }, (err, token) => {
                    if (err) {
                        next(err);
                    } else {
                        res.status(200).json({
                            code: 1,
                            student,
                            labs: results.labList,
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
        Lab.findAll({
            where: {
                ID: [ h1, h2, h3, h4 ]
            }
        }).then(fetchedLabs => {
            labs = labs.map(labID => fetchedLabs.find(lab => lab.ID === +labID));
            // Per i progetti da 2 ore seleziona la prima e la seconda ora o la terza e la quarta ora
            let error = new Error('Questo laboratori deve essere uguale a quello dell\'ora ');
            error.status = 410;

            let promiseArray = [];
            labs.forEach((lab, index) => {
    
                // Check lastsTwoH
                if (lab.lastsTwoH === true) {
                    if (index % 2 == 0) {
                        if (lab.ID !== labs[index + 1].ID) {
                            error.message += 'precedente (2H)';
                            error.target = (index + 2);
                            throw error;
                        }
                    } else {
                        if (lab.ID !== labs[index - 1].ID) {
                            error.message += 'successiva (2H)';
                            error.target = index;
                            throw error
                        }
                    }
                }
    
                // Count sub to lab
                promiseArray.push(
                    Sub.count({
                        where: { ['h' + (index + 1)]: lab.ID }
                    })
                );
            });
            return Promise.all(promiseArray);
        }).then(results => {
            let error = new Error('Posti esauriti per questo laboratorio');
            error.status = 410;
    
            labs.forEach((lab, index) => {
                if ( (lab['seatsH' + (index + 1)] - results[index] - 1 ) < 0) {
                    error.target = (index + i);
                    throw error;
                }
            });
    
            return Sub.create({
                ID: studentID, 
                h1, h2, h3, h4
            });
        }).then(sub => res.status(200).json({
            code: 1,
            labs,
            token: req.jwtNewToken
        }))
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

const fetchAvabileLabs = classLabel => {
    return new Promise((resolve, reject) => {
        let classes;
        let labList = [];

        LabClass.findAll({
            where: {
                classLabel
            },
            order: [
                ['labID', 'ASC']
            ]
        }).then(labClasses => {
            classes = labClasses || [];
            return Lab.findAll({
                order: [
                    ['ID', 'ASC']
                ]
            });
        }).then(fetchedLabs => {
            fetchedLabs = fetchedLabs || [];
            let labClass;
            let promiseArray = [];
            fetchedLabs.forEach(lab => {
                labClass = classes.find(cl => cl.labID === lab.ID);
                if (labClass) {
                    labList.push({
                        ID: lab.ID,
                        title: lab.title,
                        description: lab.description,
                        seatsH1: lab.seatsH1,
                        seatsH2: lab.seatsH2,
                        seatsH3: lab.seatsH3,
                        seatsH4: lab.seatsH4,
                        lastsTwoH: lab.lastsTwoH,
                    });
                    for (let i = 1; i <= 4; i++) {
                        promiseArray.push(Sub.count({
                            where: {
                                ['h' + i]: lab.ID
                            }
                        }));
                    }
                }
            });
            return Promise.all(promiseArray);
        }).then(results => {
            labList.map((lab, index) => {
                for (let i = 1; i <= 4; i++) {
                    if ( (lab['seatsH' + i] - results[index * 4 + (i - 1)]) > 0 && classes[index]['allowedH' + i] == 1) {
                        lab['seatsH' + i] -= results[index * 4 + (i - 1)];
                    }
                }
                return lab;
            });
            resolve({ labList });
        }).catch(err => reject(err));
    });
};


module.exports = router;