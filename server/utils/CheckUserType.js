"use strict"
const isStudent = (req, res, next) => req.userType === 'student' || req.userType === 'admin' ? next() : next(new Error('Non sei autorizzato'));
const isAdmin = (req, res, next) => req.userType === 'admin' ? next() : next(new Error('Non sei autorizzato'));

module.exports = {
    isAdmin,
    isStudent
};