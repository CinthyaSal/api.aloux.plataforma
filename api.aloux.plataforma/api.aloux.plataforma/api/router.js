const express = require('express');
const authAdmin = require('./v0/middleware/authAdmin.js');
const router = express.Router();
var fileupload = require('express-fileupload');
router.use(fileupload());

const admin = require('./v0/controllers/admin.js')
const article = require('./v0/controllers/article.js')
const worker = require('./v0/controllers/worker.js')

// Admin
router.post('/v0/admin/signup',             admin.signup)
router.post('/v0/admin/login',              admin.login)
router.get('/v0/admin/logout',              authAdmin, admin.logout)
router.get('/v0/admin',                     authAdmin, admin.retrieve)
router.get('/v0/admin/me',                  authAdmin, admin.me)
router.get('/v0/admin/:id',                 authAdmin, admin.detail)
router.put('/v0/admin/:id',                 authAdmin, admin.updateAny)
router.put('/v0/admin/profile/picture',     authAdmin, admin.updatePicture)
router.put('/v0/admin/status/:id',          authAdmin, admin.status)
router.delete('/v0/admin/delete/:id',       authAdmin, admin.delAdmin)

//Article
router.post('/v0/admin/article',            authAdmin, article.create)
router.get('/v0/admin/list/article',        authAdmin, article.retrieve)
router.get('/v0/admin/article/:id',         authAdmin, article.detail)
router.put('/v0/admin/article/picture/:id', authAdmin, article.updatePicture)
router.put('/v0/admin/article/:id',         authAdmin, article.updateAny)
router.delete('/v0/admin/article/:id',      authAdmin, article.delArticle)

//Worker
router.post('/v0/admin/worker',             authAdmin, worker.create)
router.get('/v0/admin/list/worker',         authAdmin, worker.retrieve)
router.get('/v0/admin/worker/:id',          authAdmin, worker.detail)
router.put('/v0/admin/worker/status/:id',   authAdmin, worker.status)
router.put('/v0/admin/worker/profile/:id',  authAdmin, worker.updateAny)
router.put('/v0/admin/worker/picture/:id',  authAdmin, worker.updatePicture)
router.delete('/v0/admin/worker/:id',       authAdmin, worker.delWorker)

// Usuario
module.exports = router