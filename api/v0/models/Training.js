const mongoose = require('mongoose')
const config = require("../../config")

const trainingSchema = mongoose.Schema({
    name:               { type: String, required: true, trim: true },
    email:              { type: String, required: true, trim: true },  
    school:             { type: String, required: true, trim: true },  
    program:            { type: String, required: true, trim: true },
    urlCv:              { type: String, required: true },
    phone:              { type: Number, required: true, trim: true },
    createdAt:          { type: Number, required: true }
})
  
const Training = mongoose.model("Training", trainingSchema);

module.exports = Training