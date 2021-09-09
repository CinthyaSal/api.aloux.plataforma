const Admin = require('../models/Admin')
const self = module.exports;
const axios = require('axios');
const aws = require('aws-sdk');
const config = require('../../config');

aws.config.update({
    secretAccessKey: config.aws.secretAccessKey,
    accessKeyId: config.aws.accessKeyId,
    region: config.aws.region
});

self.signup = async (req, res) => {
    try {

        const result = await Admin.findOne({email: req.body.email})
        if(result)
        res.status(409).send({error: 'El usuario con el correo '+ req.body.email +', ya existe'})
        let admin = new Admin(req.body)
        admin.createdAt = (new Date()).getTime()
        admin.lastUpdate = (new Date()).getTime()


        await admin.save()
        const token = await admin.generateAuthToken()
        delete admin.pwd

        res.status(201).send({token: token})
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.login  =  async(req, res) => {
    try {
        const { email, pwd } = req.body

        const adminLogin = await Admin.findByCredentials(email, pwd)

        if (!adminLogin) {
            return res.status(401).send({
                error: 'Credenciales incorrectas',
                suggestion: 'Verifica que el User y Contraseña sean correctas'
            })
        }
        if(!adminLogin.isActive){
            return res.status(401).send({
                error: 'User inactivo',
                suggestion: 'Pongase en contacto con soporte'
            })
        }
        else{
            const token = await adminLogin.generateAuthToken()
            res.status(200).send({token})
        }

    } catch (error) {
        res.status(500).send(error)
    }
}

self.logout = async (req, res) => {
    try {
        const admin = await Admin.findOne({_id:req.admin._id})
        console.log(req.admin._id)
        admin.tokens = admin.tokens.filter((token) => {
            return token.token != req.token
        })
        
        await admin.save()
        
        res.status(200).send()
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}