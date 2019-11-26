"use strict";
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Admin = new Schema({
    username: String,
    password: String,
    permissions: [String]
});

module.exports = mongoose.model('Admin', Admin);