"use strict";
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { adminPassword, privateKey } = require('../config');

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
                    res.status(200).json({
                        code: 1,
                        token
                    });
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
        next(new Error('Parametri non validi'));
    }
});

module.exports = router;