const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("../../config")

const PaymentsSchema = mongoose.Schema({

    name: { type: String,  required: true, trim: true },
    amount:{type:Number, require: true },
    deadLine: {type: Number,  required: true},
    paid: {type: Boolean, default: false },
    comments: {type: String, required: true }   
})

const Payments = mongoose.model('Customer', customerSchema)
module.exports = Payments