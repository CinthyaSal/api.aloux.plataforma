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

//asignar pago
self.asignPayment  =  async(req, res) => {    
    
    try {
        const id = req.admin._id
        const project = req.params.id.toString()
        const update = await Project.findOne( {_owner:id})
        if (update) {
            const buscar = update.project.find(obj=>obj._payments.toString()===payments)
            if(buscar){
                update.project.push({_payments : payments})
            }else{
                throw new Error('Proyecto no encontrado') 
            }            
        }
       
        await update.save()

        res.status(200).send(update)
    } catch (error) {
        res.status(400).send(error)
    }
}

//revertir pago
self.revert  =  async(req, res) => {    
    
    try {
        const id = req.admin._id
        const payments = req.params.id.toString()
        const update = await Project.findOne( {_owner:id})
        if (update) {
            const index = update.payments.findIndex(obj=>obj._payments.toString()===payments)
            if(update){
                update.project.splice(index, 1)
            }
            else{
                res.status(200).send("Pago no encontrado ")
            }
        
        
       await update.save()                
        res.status(200).send(update)
    } catch (error) {
        res.status(400).send(error)
    }
}