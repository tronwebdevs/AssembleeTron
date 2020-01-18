"use strict"
const isStudent = (req, res, next) => 
    req.userType === 'student' || req.userType === 'admin' || req.userType === 'sudoer' ? 
        next() : 
        next(new Error('Non sei autorizzato'));

const isAdmin = (req, res, next) => 
    req.userType === 'admin' || req.userType === 'sudoer' ? 
        next() : 
        next(new Error('Non sei autorizzato'));

const isSudoer = (req, res, next) => 
    req.userType === 'sudoer' ? 
        next() : 
        next(new Error('Non sei autorizzato'));

module.exports = {
    isAdmin,
    isStudent,
    isSudoer
};