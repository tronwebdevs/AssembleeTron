"use strict";
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Log = new Schema({
    user: String,
    message: String,
    type: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', Log);