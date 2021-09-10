const Customer = require('../models/Customer')
const self = module.exports;
const axios = require('axios');
const aws = require('aws-sdk');
const config = require('../../config');

aws.config.update({
    secretAccessKey: config.aws.secretAccessKey,
    accessKeyId: config.aws.accessKeyId,
    region: config.aws.region
});


self.create = async (req, res) => {
    
    try {
        let customer = new Customer(req.body)

        customer.isActive = true
        customer.createdAt = (new Date()).getTime()
        customer.lastUpdate = (new Date()).getTime()

        //Asignar el id del admin a la propiedad _owner
        customer._owner = req.admin._id
        
       await customer.save()
        

        res.status(201).send("successfully created")
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}