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
    tot_h: Number,
    sections: [String]
});

module.exports = mongoose.model('Assembly', Assembly);