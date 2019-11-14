"use strict";
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Assembly = new Schema({
    title: String,
    date: Date,
    subscription: {
        open: Date,
        close: Date
    },
    sections: [String],
    active: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Assembly', Assembly);