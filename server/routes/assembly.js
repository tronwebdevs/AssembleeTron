"use strict";
const express = require('express');
const router = express.Router();
const moment = require('moment');
const fs = require('fs-extra');
const path = require('path');

const Student = require('../models/Student');
const Sub = require('../models/Sub');
const Lab = require('../models/Lab');
const LabClass = require('../models/LabClass');
const AssemblyInfo = require('../models/AssemblyInfo');

const { adminPassword } = require('../config');
const assembliesBackup = path.join(__dirname, '../backups');

/**
 * Get assembly general info (admin dashboard)
 * @method get
 * @public
 */
router.get('/', (req, res, next) => {
    let labs;
    let students;

    getAllLabs()
        .then(result => {
            labs = result;
            return Student.findAll();
        })
        .then(result => {
            students = result;
            return Sub.findAll();
        })
        .then(subs => {
            students = students.map(student => {
                let subscriber = subs.find(sub => sub.ID === student.ID) || null;
                return {
                    ID: student.ID,
                    name: student.name,
                    surname: student.surname,
                    classLabel: student.classLabel,
                    subscribed: subscriber !== null ? {
                        h1: subscriber.h1,
                        h2: subscriber.h2,
                        h3: subscriber.h3,
                        h4: subscriber.h4,
                        createdAt: subscriber.createdAt,
                        updatedAt: subscriber.updatedAt
                    } : null
                };
            });
            return getInfo(true);
        })
        .then(result => res.status(200).json({
            code: result.code || 1,
            info: result.info,
            labs,
            students
        }))
        .catch(err => res.status(err.status || 500).json({
            code: err.code !== undefined ? err.code : -1,
            message: err.message,
            labs,
            students
        }));
});

/**
 * Delete assembly
 * @method post
 * @param {string} password
 * @public
 */
router.delete('/', (req, res, next) => {
    const { password } = req.body;
    if (password === adminPassword) {
        AssemblyInfo
            .destroy({
                where: {},
                truncate: true
            })
            .then(() => Lab.destroy({
                where: {},
                truncate: true
            }))
            .then(() => LabClass.destroy({
                where: {},
                truncate: true
            }))
            .then(() => Sub.destroy({
                where: {},
                truncate: true
            }))
            .then(() => res.status(200).json({ 
                code: 1
            }))
            .catch(err => next(err));
    } else {
        next(new Error('Autenticazione fallita'));
    }
});

/**
 * Get avabile backups
 * @method get
 * @public
 */
router.get('/backups', (req, res, next) => {
    if (!fs.existsSync(assembliesBackup)){
        fs.mkdirSync(assembliesBackup);
        res.status(200).json({
            code: 1,
            backups: []
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
                    backups: files
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
router.post('/backups', (req, res, next) => {
    let info;
    getInfo()
        .then(result => {
            info = result.info;
            return getAllLabs();
        })
        .then(labs => {
            if (!fs.existsSync(assembliesBackup)){
                fs.mkdirSync(assembliesBackup);
            }
            const assembly = {
                info,
                labs
            };

            const file = path.join(assembliesBackup, info.uuid + '.json');
            return fs.writeFile(file, JSON.stringify(assembly, null, 4), 'utf8');
        })
        .then(() => res.status(200).json({
            code: 1,
            message: 'Assemblea salvata con successo'
        }))
        .catch(err => next(err));
});

/**
 * Load assembly from local backup file
 * @method post
 * @public
 */
router.post('/backups/load', (req, res, next) => {
    const { uuid } = req.body;
    if (typeof uuid === 'string') {
        const file = path.join(assembliesBackup, uuid + '.json');
        let assemblyFile;
        let newAssembly = {};
        fs.readFile(file)
            .then(data => {
                assemblyFile = JSON.parse(data);
                const { info } = assemblyFile;
                const { uuid, title, date, subOpen, subClose } = info;
                return AssemblyInfo.create({
                    uuid, 
                    title, 
                    date, 
                    subOpen, 
                    subClose
                });
            })
            .then(info => {
                newAssembly.info = info;
                let promiseArray = [];
                assemblyFile.labs.forEach(lab => promiseArray.push(
                    createLab(lab)
                ));
                return Promise.all(promiseArray);
            })
            .then(results => {
                newAssembly.labs = results;
                res.status(200).json({
                    code: 1,
                    assembly: newAssembly
                });
            })
            .catch(err => next(err));
    } else {
        next(new Error('UUID non valido'));
    }
});

/**
 * Get assembly info
 * @method get
 * @public
 */
router.get('/info', (req, res, next) => {
    getInfo()
        .then(result => res.status(200).json(result))
        .catch(err => next(err));
});

/**
 * Update assembly info
 * @method put
 * @param {object} info
 * @public
 */
router.put('/info', (req, res, next) => {
    const { uuid, title, date, subOpen, subClose } = req.body.info;
    AssemblyInfo
        .findAndCountAll()
        .then(({ count, rows }) => {
            if (count === 1) {
                if (rows[0].uuid === uuid) {
                    return rows[0].update({
                        title, date, subOpen, subClose
                    });
                } else {
                    throw new Error('L\'identificativo dell\'assemblea presente sul database non combacia');
                }
            } else {
                throw new Error('Numero di assemblee presenti sul database inaspettato');
            }
        })
        .then(updatedInfo => res.status(200).json({
            code: 1,
            info: updatedInfo
        }))
        .catch(err => next(err));
});

/**
 * Create assembly info
 * @method put
 * @param {object} info
 * @public
 */
router.post('/info', (req, res, next) => {
    const { uuid, title, date, subOpen, subClose } = req.body.info;
    AssemblyInfo
        .findAndCountAll()
        .then(({ rows, count }) => {
            if (count === 1) {
                throw new Error(`E\' gia\' presente un\'assemblea nel database (${rows[0].title})`);
            } else if (count > 1) {
                throw new Error('Sono gia\' presenti di piu\' di una assemblea sul database');
            } else {
                return AssemblyInfo.create({
                    uuid, 
                    title, 
                    date, 
                    subOpen, 
                    subClose
                });
            }
        })
        .then(info => res.status(200).json({
            code: 1,
            info
        }))
        .catch(err => next(err));
});

/**
 * Get assembly laboratories
 * @method get
 * @param {string} action
 * @param {string=} classLabel
 * @public
 */
router.get('/labs', (req, res, next) => {
    const { action } = req.query;
    if (action === 'count') {
        Lab
            .count()
            .then(c => res.status(200).json({
                code: 1,
                labs: c
            }))
            .catch(err => next(err));
    } else if (action === 'getAll') {
        getAllLabs()
            .then(labs => {
                // labs = labs.map(lab => ({
                //     ID: lab.ID,
                //     title: lab.title,
                //     description: lab.description,
                //     room: lab.room,
                //     seatsH1: lab.seatsH1,
                //     seatsH2: lab.seatsH2,
                //     seatsH3: lab.seatsH3,
                //     seatsH4: lab.seatsH4,
                //     lastsTwoH: lab.lastsTwoH
                // }));
                res.status(200).json({
                    code: 1,
                    labList: labs
                });
            })
            .catch(err => res.status(500).json({
                code: -1,
                message: err.message
            }));
    } else if (action === 'getAvab') {
        if (typeof req.query.classLabel === 'string') {
            let classes;
            let labList = [];
            LabClass
                .findAll({
                    where: {
                        classLabel: req.query.classLabel
                    },
                    order: [
                        ['labID', 'ASC']
                    ]
                })
                .then(labClasses => {
                    classes = labClasses || [];
                    return Lab.findAll({
                        order: [
                            ['ID', 'ASC']
                        ]
                    });
                })
                .then(fetchedLabs => {
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
                })
                .then(results => {
                    labList.map((lab, index) => {
                        for (let i = 1; i <= 4; i++) {
                            if ((lab['seatsH' + i] - results[index * 4 + (i - 1)]) > 0 && classes[index]['allowedH' + i] == 1) {
                                lab['seatsH' + i] -= results[index * 4 + (i - 1)];
                            }
                        }
                        return lab;
                    });
                    res.status(200).json({
                        code: 1,
                        labList
                    });
                })
                .catch(err => res.status(500).json({
                    code: -1,
                    message: err.message
                }));
        } else {
            next(new Error('Parametri non accettati'));
        }

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
router.put('/labs', (req, res, next) => {
    const { lab } = req.body;
    let upLab = null;
    if (lab && typeof lab.ID === 'number') {
        Lab
            .findOne({
                where: { ID: lab.ID }
            })
            .then(fLab => {
                if (fLab) {
                    return fLab.update({
                        title: lab.title,
                        description: lab.description,
                        room: lab.room,
                        seatsH1: lab.seatsH1,
                        seatsH2: lab.seatsH2,
                        seatsH3: lab.seatsH3,
                        seatsH4: lab.seatsH4,
                        lastsTwoH: lab.lastsTwoH
                    });
                } else {
                    throw new Error('Laboratorio inesistente (ID: ' + lab.ID);
                }
            })
            .then(lab => {
                upLab = lab;
                return LabClass.destroy({
                    where: { labID: upLab.ID }
                });
            })
            .then(() => {
                let promiseArray = [];
                let classes = uniqueArray(lab.classesH1.concat(lab.classesH2, lab.classesH3, lab.classesH4));
                classes.forEach(cl => promiseArray.push(LabClass.create({
                    classLabel: cl,
                    labID: upLab.ID,
                    allowedH1: ( lab.classesH1.indexOf(cl) === -1 ? false : true),
                    allowedH2: ( lab.classesH2.indexOf(cl) === -1 ? false : true),
                    allowedH3: ( lab.classesH3.indexOf(cl) === -1 ? false : true),
                    allowedH4: ( lab.classesH4.indexOf(cl) === -1 ? false : true)
                })));
                return Promise.all(promiseArray);
            })
            .then(() => res.status(200).json({
                code: 1,
                lab
            }))
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
router.post('/labs', (req, res, next) => {
    const { lab } = req.body;
    if (lab) {
        createLab(lab)
            .then(newLab => res.status(200).json({
                code: 1,
                lab: newLab
            }))
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
router.delete('/labs', (req, res, next) => {
    const { ID } = req.body;
    if (!isNaN(+ID)) {
        LabClass
            .destroy({
                where: { labID: ID }
            })
            .then(() => Lab.destroy({
                where: { ID }
            }))
            .then(() => res.status(200).json({
                code: 1,
                labID: ID
            }))
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
router.get('/students', (req, res, next) => {
    const { action } = req.query;
    if (action === 'count') {
        let stdCount;

        Student
            .count()
            .then(c => {
                stdCount = c;
                return Sub.count();
            })
            .then(c => res.status(200).json({
                code: 1,
                students: stdCount,
                subs: c
            }))
            .catch(err => next(err));
    } else if (action === 'getAll') {
        Student
            .findAll()
            .then(students => res.status(200).json({
                code: 1,
                students
            }))
            .catch(err => next(err));
    } else {
        next(new Error('Parametri non accettati'));
    }
});

/**
 * Get assembly info
 * @param {boolean} forseResponse 
 * @private
 */
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
                                title: result.title,
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
};

/**
 * Get assembly laboratories
 * @private
 */
const getAllLabs = () => {
    let classes;
    return LabClass
        .findAll({
            order: [
                ['labID', 'ASC']
            ]
        })
        .then(labClasses => {
            classes = labClasses || [];
            return Lab.findAll({
                order: [
                    ['ID', 'ASC']
                ]
            });
        })
        .then((labs = []) => {
            let labList = labs.map(lab => ({
                ID: lab.ID,
                title: lab.title,
                description: lab.description,
                room: lab.room,
                seatsH1: lab.seatsH1,
                seatsH2: lab.seatsH2,
                seatsH3: lab.seatsH3,
                seatsH4: lab.seatsH4,
                lastsTwoH: lab.lastsTwoH
            }));
            labList = labList.map(lab => {
                let labClasses = classes.filter(cl => cl.labID === lab.ID);
                for (let i = 1; i <= 4; i++) {
                    lab['classesH' + i] = labClasses.filter(cl => cl['allowedH' + i] === true).map(cl => cl.classLabel);
                }
                return lab;
            });
            
            return labList;
        });
};

/**
 * Create new laboratory
 * @param {object} lab 
 * @private
 */
const createLab = lab => {
    let promiseArray = [];
    let classes = uniqueArray(lab.classesH1.concat(lab.classesH2, lab.classesH3, lab.classesH4));
    classes.forEach(cl => promiseArray.push(LabClass.create({
        classLabel: cl,
        labID: +lab.ID || null,
        allowedH1: ( lab.classesH1.indexOf(cl) === -1 ? false : true),
        allowedH2: ( lab.classesH2.indexOf(cl) === -1 ? false : true),
        allowedH3: ( lab.classesH3.indexOf(cl) === -1 ? false : true),
        allowedH4: ( lab.classesH4.indexOf(cl) === -1 ? false : true)
    })));
    return new Promise((resolve, reject) => {
        Promise
            .all(promiseArray)
            .then(() => Lab.create({
                    ID: lab.ID,
                    room: lab.room,
                    title: lab.title,
                    description: lab.description,
                    seatsH1: lab.seatsH1,
                    classesH1: lab.classesH1,
                    seatsH2: lab.seatsH2,
                    classesH2: lab.classesH2,
                    seatsH3: lab.seatsH3,
                    classesH3: lab.classesH3,
                    seatsH4: lab.seatsH4,
                    classesH4: lab.classesH4,
                    lastsTwoH: lab.lastsTwoH
            }))
            .then(newLab => resolve(newLab))
            .catch(err => reject(err));
    });
};

/**
 * Make array unique
 * @param {array} arrArg 
 * @private
 */
const uniqueArray = arrArg => arrArg.filter(
    (elem, pos, arr) => arr.indexOf(elem) === pos
);


module.exports = router;