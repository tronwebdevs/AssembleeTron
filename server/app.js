const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');

const Student = require('./models/Student');
const Sub = require('./models/Sub');
const Lab = require('./models/Lab');
const LabClass = require('./models/LabClass');
const AssemblyInfo = require('./models/AssemblyInfo');

app.use(require('helmet')());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * @method get
 * @param {string} studentID
 * @param {string} part
 */
app.get('/api/students', (req, res) => {
    let student;
    const studentID = +req.query.studentID || -1;
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
                    let classes;
                    let labList = [];

                    return LabClass.findAll({
                        where: {
                            classLabel: student.classLabel
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
                        return new Promise(resolve => resolve({ labList }));
                    });
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
                        // STUDENTE SI E' DISISCRITTO
                        res.status(200).json({
                            code: 3,
                            student,
                            wasSubscribed: true
                        });
                    } else {
                        res.status(200).json({
                            code: 4,
                            student,
                            labs: [
                                results.h1,
                                results.h2,
                                results.h3,
                                results.h4,
                            ],
                            wasSubscribed: true
                        });
                        // STUDENTE VUOLE VISUALIZZARE I LABORATORI
                        // Lab.findAndCountAll({
                        //     where: {
                        //         id: [ results.h1, results.h2, results.h3, results.h4 ]
                        //     }
                        // }).then(result => {
                        //     if (result.count <= 4 || result.count > 0) {
                        //         res.status(200).json({
                        //             code: 4,
                        //             student,
                        //             labs: result.rows,
                        //             wasSubscribed: true,
                        //         });
                        //     } else {
                        //         next(new Error('Errore inaspettato: numero di laboratori inaspettato (' + result.count + ')'));
                        //     }
                        // }).catch(err => next(err));
                    }
                } else {
                    // LO STUDENTE NON PARTECIPA ALL'ASSEMBLEA
                    res.status(200).json({
                        code: 2,
                        student,
                        wasSubscribed: false
                    });
                }
            } else if (results.labList) {
                // STUDENTE DEVE ISCRIVERSI, `results.labList` E' LA LISTA DEI LABORATORI
                res.status(200).json({
                    code: 1,
                    student,
                    labs: results.labList,
                    wasSubscribed: false
                });
            } else {
                throw new Error('Risultato inaspettato');
            }
        })
        .catch(err => {
            res.status(err.status || 500).json({
                code: -1,
                message: err.message
            });
        });
    }
});

/**
 * @method post
 */
app.post('/api/students', (req, res) => res.status(200).end());


/**
 * @method get
 */
app.get('/api/assembly/info', (req, res, next) => {
    AssemblyInfo.findAll().then(result => {
        if (result && result.length > 0) {
            if (moment(result[0].date).diff(moment()) < 0) {
                res.status(200).json({
                    code: 0,
                    message: 'Nessuna assemblea in programma'
                });
            } else {
                if (moment(result[0].subOpen).diff(moment()) > 0) {
                    res.status(200).json({
                        code: 1,
                        message: 'La iscrizioni sono attualmente chiuse, torna più tardi'
                    });
                } else {
                    if (moment(result[0].subClose).diff(moment()) > 0) {
                        res.status(200).json({
                            code: 2,
                            info: {
                                uuid: result[0].uuid,
                                date: result[0].date,
                                subOpen: result[0].subOpen,
                                subClose: result[0].subClose
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
app.get('/api/assembly/labs/:type', (req, res) => {
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


app.use((err, req, res, next) => {
    res.status(500).json({
        code: -1,
        message: err.message
    });
});

app.listen(6000, () => {
    Student.sync()
    .then(() => Sub.sync())
    .then(() => Lab.sync())
    .then(() => LabClass.sync())
    .then(() => AssemblyInfo.sync());
    console.log('SERVER STARTED ON PORT 6000')
});