"use strict";
const express = require('express');
const router = express.Router();
const moment = require('moment');

const Student = require('../models/Student');
const Sub = require('../models/Sub');
const Lab = require('../models/Lab');
const LabClass = require('../models/LabClass');
const AssemblyInfo = require('../models/AssemblyInfo');

/**
 * @method get
 */
router.get('/', (req, res, next) => {
    let labsCount;
    let stdCount;
    let subsCount;

    Lab.count().then(c => {
        labsCount = c;
        return Student.count();
    }).then(c => {
        stdCount = c;
        return Sub.count();
    }).then(c => {
        subsCount = c;
        return getInfo(true);
    }).then(result => {
        res.status(200).json({
            code: result.code || 1,
            info: result.info,
            labsCount,
            stdCount,
            subsCount
        });
    }).catch(err => res.status(err.status || 500).json({
        code: err.code || -1,
        message: err.message,
        labsCount,
        stdCount,
        subsCount
    }));
});

/**
 * @method get
 */
router.get('/info', (req, res, next) => {
    getInfo()
    .then(result => res.status(200).json(result))
    .catch(err => next(err));
});

/**
 * @method get
 * @param {string} action
 * @param {string} classLabel
 */
router.get('/labs', (req, res, next) => {
    const { action } = req.query;
    if (action === 'count') {
        Lab.count().then(c => res.status(200).json({
            code: 1,
            labs: c
        })).catch(err => next(err));
    } else if (action === 'getAll') {
        Lab.findAll({
            order: [
                ['id', 'ASC']
            ]
        })
        .then(labs => {
            labs = labs.map(lab => ({
                ID: lab.id,
                title: lab.title,
                room: lab.room
            }));
            
            res.status(200).json({
                code: 1,
                labList: labs
            });
        }).catch(err => res.status(500).json({
            code: -1,
            message: err.message
        }));
    } else if (action === 'getAvab') {
        if (typeof req.query.classLabel === 'string') {
            let classes;
            let labList = [];
            LabClass.findAll({
                where: {
                    classLabel: req.query.classLabel
                },
                order: [
                    ['labID', 'ASC']
                ]
            }).then(labClasses => {
                classes = labClasses || [];
                return Lab.findAll({
                    order: [
                        ['id', 'ASC']
                    ]
                });
            }).then(fetchedLabs => {
                fetchedLabs = fetchedLabs || [];
                let labClass;
                let promiseArray = [];
                fetchedLabs.forEach(lab => {
                    labClass = classes.find(cl => cl.labID === lab.id);
                    if (labClass) {
                        labList.push({
                            ID: lab.id,
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
                                    ['h' + i]: lab.id
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
                res.status(200).json({
                    code: 1,
                    labList
                });
            }).catch(err => res.status(500).json({
                code: -1,
                message: err.message
            }));
        } else {
            res.status(200).json({
                code: -1,
                message: 'Parametri non accettati'
            });
        }

    } else {
        res.status(200).json({
            code: -1,
            message: 'Parametri non accettati'
        });
    }
});

/**
 * @method get
 */
router.get('/students', (req, res, next) => {
    const { action } = req.query;
    if (action === 'count') {
        let stdCount;

        Student.count().then(c => {
            stdCount = c;
            return Sub.count();
        }).then(c => {
            res.status(200).json({
                code: 1,
                students: stdCount,
                subs: c
            }).catch(err => next(err));
        });
    }
});

const getInfo = (forseResponse = false) => {
    let error = new Error('Errore');
    return AssemblyInfo.findAndCountAll().then(results => {
        if (results.count > 0) {
            const result = results.rows[0];
            if (moment(result.date).diff(moment()) < 0 && !forseResponse) {
                error.code = 0;
                error.message = 'Nessuna assemblea in programma';
                throw error;
            } else {
                if (moment(result.subOpen).diff(moment()) > 0 && !forseResponse) {
                    error.code = 1;
                    error.message = 'La iscrizioni sono attualmente chiuse, torna più tardi';
                    throw error;
                } else {
                    if (moment(result.subClose).diff(moment()) > 0 || forseResponse) {
                        return {
                            code: 2,
                            info: {
                                uuid: result.uuid,
                                date: result.date,
                                subOpen: result.subOpen,
                                subClose: result.subClose
                            }
                        };
                    } else {
                        error.code = 3;
                        error.message = 'La iscrizioni sono terminate';
                        throw error;
                    }
                }
            }
        } else {
            error.code = 0;
            error.message = 'Nessuna assemblea in programma';
            throw error;
        }
    });
}

module.exports = router;