"use strict";
const express = require('express');
const router = express.Router();
const Sequleize = require('sequelize');
const { Op } = Sequleize;

/**
 * @method post
 * @param {string} username
 * @param {string} password
 */
router.post('/auth', (req, res, next) => {
    if (req.body.username && req.body.password) {
        res.status(200).json({
            code: 1,
            id: 1,
            username: req.body.username,
            isSudoer: true
        });
    } else {
        next(new Error('Parametri non validi'));
    }
});

module.exports = router;