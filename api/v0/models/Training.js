const mongoose = require('mongoose')
const config = require("../../config")

const trainingSchema = mongoose.Schema({
    name:               { type: String, required: true, trim: true },
    email:              { type: String, required: true, trim: true },  
    school:             { type: Number, required: true, trim: true },  
    program:            { type: String, required: true, trim: true },
    phone:              { type: Number, required: true, trim: true }
})
  
const Training = mongoose.model("Training", trainingSchema);

module.exports = Training