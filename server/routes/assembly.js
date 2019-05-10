"use strict";
const express = require('express');
const router = express.Router();
const moment = require('moment');

const Sub = require('../models/Sub');
const Lab = require('../models/Lab');
const LabClass = require('../models/LabClass');
const AssemblyInfo = require('../models/AssemblyInfo');

/**
 * @method get
 */
router.get('/info', (req, res, next) => {
    AssemblyInfo.findAndCountAll().then(results => {
        if (results.count > 0) {
            const result = results.rows[0];
            if (moment(result.date).diff(moment()) < 0) {
                res.status(200).json({
                    code: 0,
                    message: 'Nessuna assemblea in programma'
                });
            } else {
                if (moment(result.subOpen).diff(moment()) > 0) {
                    res.status(200).json({
                        code: 1,
                        message: 'La iscrizioni sono attualmente chiuse, torna più tardi'
                    });
                } else {
                    if (moment(result.subClose).diff(moment()) > 0) {
                        res.status(200).json({
                            code: 2,
                            info: {
                                uuid: result.uuid,
                                date: result.date,
                                subOpen: result.subOpen,
                                subClose: result.subClose
                            }
                        });
                    } else {
                        res.status(200).json({
                            code: 3,
                            message: 'La iscrizioni sono terminate'
                        });
                    }
                }
            }
        } else {
            res.status(200).json({
                code: 0,
                message: 'Nessuna assemblea in programma'
            });
        }
    }).catch(err => next(err));
});

/**
 * @method get
 */
router.get('/labs/:type', (req, res) => {
    if (req.params.type === 'all') {
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
    } else if (req.params.type === 'avabile') {
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

module.exports = router;