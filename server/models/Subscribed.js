"use strict";
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Subscribed = new Schema({
    studentId: Number,
    labs: [Schema.Types.ObjectId],
    createdAt: Date,
    updatedAt: Date
});

module.exports = mongoose.model('Subscribed', Subscribed);