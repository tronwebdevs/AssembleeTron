"use strict";
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Laboratory = new Schema({
    title: String,
    description: String,
    room: String,
    info: {
        h1: {
            seats: {
                type: Number,
                min: 0
            },
            sections: [String]
        },
        h2: {
            seats: {
                type: Number,
                min: 0
            },
            sections: [String]
        },
        h3: {
            seats: {
                type: Number,
                min: 0
            },
            sections: [String]
        },
        h4: {
            seats: {
                type: Number,
                min: 0
            },
            sections: [String]
        }
    },
    two_h: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Laboratory', Laboratory);