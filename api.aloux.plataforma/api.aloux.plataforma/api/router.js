const express = require('express');
const authAdmin = require('./v0/middleware/authAdmin.js');
const router = express.Router();
var fileupload = require('express-fileupload');
router.use(fileupload());

const admin = require('./v0/controllers/admin');

// Admin
router.post('/v0/admin/signup',  admin.signup);
router.post('/v0/admin/login',   admin.login);
router.get('/v0/admin/logout',   authAdmin, admin.logout);



// Usuario
module.exports = router