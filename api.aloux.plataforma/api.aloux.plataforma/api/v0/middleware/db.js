const mongoose = require('mongoose')
const config = require('../../config')

mongoose.connect( config.database.server , {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true 
})