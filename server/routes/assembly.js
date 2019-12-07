"use strict";
const express = require('express');
const router = express.Router();
const moment = require('moment');
const fs = require('fs-extra');
const path = require('path');
const PDFDocument = require('../utils/PDFDocumentsWithTable');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const Assembly = require('../models/Assembly');
const Laboratory = require('../models/Laboratory');
const Student = require('../models/Student');
const Subscribed = require('../models/Subscribed');

const authUser = require('../utils/AuthUser');
const { isAdmin, isStudent } = require('../utils/CheckUserType');

const assembliesBackups = path.join(__dirname, '../backups');
const assembliesPdfs = path.join(__dirname, '../pdfs');

/**
 * Get assembly info
 * @method get
 * @public
 */
router.get('/info', (req, res, next) =>
    Assembly.find()
        .then(results => {
            let noAssemblyError = new Error('Nessuna assemblea in programma');
            noAssemblyError.code = 0;
            if (results.length === 0) {
                throw noAssemblyError;
            } else {
                let assembly = results[0];
                if (moment(assembly.date).diff(moment()) < 0) {
                    throw noAssemblyError;
                } else {
                    let response = {
                        code: -1,
                        message: null,
                        info: assembly.toObject()
                    };
                    
                    if (moment(assembly.subscription.open).diff(moment()) > 0) {
                        response.code = 1;
                        response.message = 'La iscrizioni sono attualmente chiuse, torna più tardi';
                    } else {
                        if (moment(assembly.subscription.close).diff(moment()) > 0) {
                            response.code = 2;
                        } else {
                            response.code = 3;
                            response.message = 'La iscrizioni sono terminate';
                        }
                    }

                    res.status(200).json(response);
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
            res.status(200)
                .json({
                    code: results.length > 0 ? 1 : 0,
                    info: results.length > 0 ? results[0] : null,
                    labs,
                    students,
                    subs
                })
        )
        .catch(err => 
            res.status(err.status || 500)
                .json({
                    code: err.code !== undefined ? err.code : -1,
                    message: err.message,
                    labs,
                    students
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
            res
                .status(200)
                .json({ 
                    code: 1
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
    if (!fs.existsSync(assembliesBackups)){
        fs.mkdirSync(assembliesBackups);
        res.status(200)
            .json({
                code: 1,
                backups: []
            });
    } else {
        let files;
        fs.readdir(assembliesBackups)
            .then(result => {
                files = result;
                let promiseArray = [];
                files.forEach(file => promiseArray.push(
                    fs.readFile(
                        path.join(assembliesBackups, file)
                    )
                ));
                return Promise.all(promiseArray);
            })
            .then(results => {
                files = files.map((file, index) => JSON.parse(results[index]));
                res.status(200)
                    .json({
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
router.post('/backups', isAdmin, (req, res, next) => {
    const { overwrite } = req.body;
    let info;
    Assembly.find()
        .then(results => {
            info = results[0];
            return Laboratory.find();
        })
        .then(labs => {
            if (!fs.existsSync(assembliesBackups)){
                fs.mkdirSync(assembliesBackups);
            }
            const file = path.join(assembliesBackups, info._id + '.json');
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
        .then(() => 
            res.status(200)
                .json({
                code: 1,
                message: 'Assemblea salvata con successo'
            })
        )
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
        const file = path.join(assembliesBackups, _id + '.json');
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
                res.status(200)
                    .json({
                        code: 1,
                        assembly: newAssembly
                    });
            })
            .catch(err => next(err));
    } else {
        next(new Error('Identificativo non valido'));
    }
});

/**
 * Export assembly into PDF file
 * @method get
 * @public
 */
router.get('/export', (req, res, next) => {
    if (!fs.existsSync(assembliesPdfs)){
        fs.mkdirSync(assembliesPdfs);
    }
    const doc = new PDFDocument;
    let file;
    let labs;
    let students;
    let stream;
    Assembly.find()
        .then(results => {
            file = path.join(assembliesPdfs, results[0]._id + '.pdf');
            stream = doc.pipe(fs.createWriteStream(file));
            return Laboratory.find();
        })
        .then(results => {
            labs = results;
            return Student.find();
        })
        .then(results => {
            students = results.map(std => std.toObject());
            return Subscribed.find();
        })
        .then(subs => {
            subs = subs.map(sub => {
                let std = students.find(s => s.studentId === sub.studentId) || null;
                return {
                    ...std,
                    labs: { ...sub.toObject() }
                };
            });

            labs.forEach((lab, index, arr) => {
                for (let i = 1; i <= 4; i++) {
                    let labStudents = [];

                    doc.fontSize(24).text(lab.title + ' - ora ' + i).fontSize(16);
                    subs.filter(
                        sub => sub.labs['h' + i].equals(lab._id)
                    ).forEach(sub => labStudents.push([sub.name, sub.surname, sub.section]));

                    doc.moveDown().table({
                        headers: ['Nome', 'Cognome', 'Classe'],
                        rows: labStudents
                    }).moveDown();

                    if (!(i === 4 && index === (arr.length - 1))) {
                        doc.addPage();
                    }
                }
            });
            doc.end();
            stream.on('finish', () => {
                const data = fs.readFileSync(file);
                res.status(200)
                    .contentType('application/pdf')
                    .end(data);
            });
        })
        .catch(err => next(err));
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
                res.status(200)
                    .json({
                        code: 1,
                        info: result
                    });
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
    info.subscription = {
        open: info.subOpen,
        close: info.subClose,
    };

    new Assembly(info).save()
        .then(assembly => 
            res.status(200)
                .json({
                    code: 1,
                    info: assembly
                })
        )
        .catch(err => next(err));
});

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
                res.status(200)
                    .json({
                        code: 1,
                        labs: c
                    })
            )
            .catch(err => next(err));
    } else if (action === 'getAll') {
        Laboratory.find()
            .then(labs =>
                res.status(200)
                    .json({
                        code: 1,
                        labList: labs
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
                    res.status(200)
                        .json({
                            code: 1,
                            lab: result
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
                res.status(200)
                    .json({
                        code: 1,
                        lab: newLab
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
                    res.status(200)
                        .json({
                            code: 1,
                            lab
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
                res.status(200)
                    .json({
                        code: 1,
                        students: stdCount,
                        subs: c
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
                        ...sub.toObject(),
                        studentId: undefined
                    } : null;
                    return student;
                });
                res.status(200)
                    .json({
                        code: 1,
                        students
                    });
            })
            .catch(err => next(err));
    } else {
        next(new Error('Parametri non accettati'));
    }
});

module.exports = router;