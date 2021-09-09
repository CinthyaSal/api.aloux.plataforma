const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const config = require('../../config')

const authAdmin = async(req, res, next) => {
    try {
        
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, config.auth.secret)
        const admin = await Admin.findOne({ _id: data._id, 'tokens.token': token })
        
        if (!admin) {
            throw new Error()
        }
        req.admin = admin
        req.token = token

        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }

}
module.exports = authAdmin