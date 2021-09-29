const mongoose = require('mongoose')
const config = require("../../config")
const { ObjectId } = require('mongodb')

const CustomerSchema = mongoose.Schema({

    name: { type: String,  required: true, trim: true },
    telephone: { type: String,  required: true, trim: true },
    email: { type: String,  required: true, trim: true, unique: true },
    logo: { type: String, required: true }, 
    rfc:{ type: String,  required: true, trim: true, unique: true },
    isActive:       { type: Boolean, default: true },
    businessName: {type: String,  required: true, trim: true},
    _owner: { type: ObjectId, ref: 'Admin'}, 
    createdAt:      { type: Number,  required: true},
    lastUpdate:     { type: Number,  required: false },
    
})
const Customer = mongoose.model('Customer', CustomerSchema)
module.exports = Customer