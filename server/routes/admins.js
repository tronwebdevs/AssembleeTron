"use strict";
const express = require('express');
const router = express.Router();

const { adminPassword } = require('../config');

/**
 * @method post
 * @param {string} password
 */
router.post('/auth', (req, res, next) => {
    const { password } = req.body;
    if (password) {
        if (password === adminPassword) {
            res.status(200).json({
                code: 1
            });
        } else {
            res.status(200).json({
                code: -1,
                message: 'Password errata'
            });
        }
    } else {
        next(new Error('Parametri non validi'));
    }
});

module.exports = router;