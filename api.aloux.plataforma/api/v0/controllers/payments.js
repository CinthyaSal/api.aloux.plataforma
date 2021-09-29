const Payments = require('../models/Payments')
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
        const { name, amount, deadLine, comments } = req.body

        const payments = new Payments({ name, amount, deadLine, comments })      
        const result = await payments.save()

        res.status(201).send(result)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.updatePayments = async( req, res) =>{
    try {
        const { name, amount, deadLine, comments} = req.body

        const _id = req.params.id

            let payments = await Payments.findOne({_id})

            if(!payments)
             throw new Error('Pago no encontrado')        
             
        const update = await Payments.updateOne( { _id },{ $set:{ name, amount, deadLine, comments })
        
        res.status(202).send(update)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}


self.deletePayments = async(req, res) => {    
    
    try {
        const _id = req.params.id
        const del = await Payments.findByIdAndRemove({ _id })
        
        res.status(200).send(del)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

