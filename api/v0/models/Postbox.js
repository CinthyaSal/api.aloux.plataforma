const mongoose = require('mongoose')
const config = require("../../config")

const postboxSchema = mongoose.Schema({
    name:               { type: String, required: true, trim: true },
    email:              { type: String, required: true, trim: true },  
    phone:              { type: Number, required: true, trim: true },  
    comment:            { type: String, required: true, trim: true }
})
  
const Postbox = mongoose.model("Postbox", postboxSchema);

module.exports = Postbox