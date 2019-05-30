"use strict";
const express = require('express');
const router = express.Router();

/**
 * @method post
 * @param {string} username
 * @param {string} password
 */
router.post('/auth', (req, res, next) => {
    if (req.body.password) {
        if (req.body.password === 'admin') {
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