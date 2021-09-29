const mongoose = require('mongoose')
const config = require("../../config")
const { ObjectId } = require('mongodb')

const StageSchema = mongoose.Schema({
    name:               { type: String,  required: true, trim: true },
    comments:           { type: String,  required: true },
    startDate:          { type: Number,  required: true },
    endDate:            { type: Number,  required: true },
    current:            { type: Boolean, default: true },
    _project:           { type: ObjectId , ref: 'Project'},
    lastUpdate:         { type: Number, required: false }
})

const Stage = mongoose.model("Stage", StageSchema);
module.exports = Stage