"use strict";
const mongoose = require('mongoose');
const { Schema } = mongoose;

const LabInfo = new Schema({
    seats: {
        type: Number,
        min: 0
    },
    sections: [String]
}, { _id: false });

const Laboratory = new Schema({
    title: String,
    description: String,
    room: String,
    info: [LabInfo],
    two_h: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Laboratory', Laboratory);