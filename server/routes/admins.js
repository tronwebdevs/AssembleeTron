"use strict";
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Log = require('../models/Log');

const { adminPassword, sudoerPassword, privateKey } = require('../config');

/**
 * @method post
 * @param {string} password
 */
router.post('/auth', (req, res, next) => {
    const { password } = req.body;
    if (password) {
        if (password === adminPassword) {
            jwt.sign({
                id: null,
                type: 'admin'
            }, privateKey, { expiresIn: 60 * 5 }, (err, token) => {
                if (err) {
                    next(err);
                } else {
                    new Log({
                        user: 'Rappresentanti',
                        message: 'Logged in',
                        type: 'INFO'
                    }).save()
                    .finally(() =>
                        res.status(200).json({
                            code: 1,
                            token
                        })
                    );
                }
            });
        } else {
            res.status(401).json({
                code: -1,
                message: 'Password errata',
                token: null
            });
        }
    } else {
        let error = new Error('Parametri non validi');
        error.status = 410;
        next(error);
    }
});

router.post('/auth_sudoer', (req, res, next) => {
    const { password } = req.body;
    if (password) {
        if (password === sudoerPassword) {
            jwt.sign({
                id: null,
                type: 'sudoer'
            }, privateKey, { expiresIn: 60 * 5 }, (err, token) => {
                if (err) {
                    next(err);
                } else {
                    new Log({
                        user: 'Rappresentanti',
                        message: 'Sudo authed',
                        type: 'INFO'
                    }).save()
                    .finally(() =>
                        res.status(200).json({
                            code: 1,
                            token
                        })
                    );
                }
            });
        } else {
            res.status(401).json({
                code: -1,
                message: 'Password errata',
                token: null
            });
        }
    } else {
        let error = new Error('Parametri non validi');
        error.status = 410;
        next(error);
    }
});

module.exports = router;