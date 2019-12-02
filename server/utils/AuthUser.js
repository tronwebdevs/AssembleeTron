"use strict"
const jwt = require('jsonwebtoken');

const { privateKey } = require('../config');

const processRequest = (req, res, next) => {
    const authRequiredError = new Error('Autenticazione Richiesta');
    if (req.headers['authorization']) {
        const authHeader = req.headers['authorization'];
        if (authHeader.indexOf(' ') >= 0 && authHeader.indexOf(' ') === authHeader.lastIndexOf(' ')) {
            const [ method, bearerToken ] = authHeader.split(/\s/g);
            if (method === 'Bearer' && bearerToken) {
                jwt.verify(bearerToken, privateKey, (err, decoded) => {
                    if (err) {
                        next(new Error('Token di autenticaztione errato'));
                    } else {
                        jwt.sign({
                            id: decoded.id,
                            type: decoded.type
                        }, privateKey, { expiresIn: 60 * 5 }, (err, token) => {
                            if (err) {
                                next(err);
                            } else {
                                res.setHeader('Token', token);
                                req.userType = decoded.type;
                                req.userID = decoded.id;
                                next();
                            }
                        });
                    }
                });
            } else {
                next(authRequiredError);
            }
        } else {
            next(authRequiredError);
        }
    } else {
        next(authRequiredError);
    }
};

module.exports = processRequest;