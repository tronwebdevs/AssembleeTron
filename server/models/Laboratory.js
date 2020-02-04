"use strict";
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Laboratory = new Schema({
    title: String,
    description: String,
    room: String,
    info: [
        {
            seats: {
                type: Number,
                min: 0
            },
            sections: [String]
        }
    ],
    two_h: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Laboratory', Laboratory);