const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')
const config = require("../../config")

const WorkerSchema = mongoose.Schema({
    name:               { type: String,  required: true, trim: true },
    createdAt:          { type: Number,  required: true},
    lastUpdate:         { type: Number,  required: false },
    phone:              { type: String,  required: true, trim: true },
    email:              { type: String,  required: true, trim: true, unique: true },
    isActive:           { type: Boolean, default: true },
    img:                { type: String }, 
})

const Worker = mongoose.model("Worker", WorkerSchema);
module.exports = Worker