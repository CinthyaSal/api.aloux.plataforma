const express = require('express')
const methodOverride  = require('method-override')
const router = require('./router')
const config = require('./config')

require('./v0/middleware/db')

const app = express()


// CORDS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    next();
});

app.use(express.json())
app.use(methodOverride())
app.use(router)
app.use('/exported-images', express.static('static'))

app.listen( config.port , () => {
    console.log(`\n - - - - - - - - - - - - - - - - - - - - - - - - - - - -`);
    console.log(` | API REST [api.aloux.platafora] - http://localhost:${ config.port }/v0/ | `);
    console.log(` - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n`);
})