const mongoose = require('mongoose')
const config = require("../../config")

const StageSchema = mongoose.Schema({
    name:               { type: String,  required: true, trim: true },
    comments:           { type: String,  required: true },
    startDate:          { type: Number,  required: true },
    endDate:            { type: Number,  required: true },
    current:            { type: Boolean, default: true },
    //_proyecto:          { type: ObjectId , ref: 'Proyect'},
    lastUpdate:         { type: Number, required: false }
})

const Stage = mongoose.model("Stage", StageSchema);
module.exports = Stage