const mongoose = require('mongoose')
const config = require("../../config")
const { ObjectId } = require('mongodb')

const HourSchema = mongoose.Schema({
    service:            { type: String, required: true },
    _trabajador:        { type: ObjectId, ref: 'Worker' },
    _proyecto:          { type: ObjectId, ref: 'Project' },
    costHour:           { type: Number, required: false },
    numberHours:        { type: Number, required: false},
    totalPay:           { type: Number, required: false },
    paidUp:             { type: Boolean, required: false },
    payDay:             { type: Number, required: false },
    createdAt:          { type: Number, required: false },
    lastUpdate:         { type: Number, required: false },
})

const Hour = mongoose.model("Hour", HourSchema);
module.exports = Hour