"use strict";
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Subscribed = new Schema({
    studentId: Number,
    labs: {
        h1: Schema.Types.ObjectId,
        h2: Schema.Types.ObjectId,
        h3: Schema.Types.ObjectId,
        h4: Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('Subscribed', Subscribed);