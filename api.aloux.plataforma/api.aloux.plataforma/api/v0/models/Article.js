const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')
const config = require("../../config")

const ArticleSchema = mongoose.Schema({

    title:              { type: String,  required: true, trim: true },
    category:           { type: String,  required: true, trim: true },
    textContent:        { type: String,  required: true, trim: true },
    img:                { type: String },
    createdAt:          { type: Number,  required: true},
    publicationDate:    { type: Number,  required: true},
    lastUpdate:         { type: Number,  required: false },
    _owner:             { type: ObjectId , ref: 'Admin'}
})

const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article