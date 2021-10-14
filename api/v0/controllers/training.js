const Training = require('../models/Training')
const Config = require('../../config')

const self = module.exports;


self.create = async (req, res) => {

    try {
        let training = new Training(req.body)
        
        await training.save()
        
        res.status(201).send(training)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.retrieve = async(req, res) => {    
    try {

        const retrieve = await Training.find({})
        
        res.status(200).send(retrieve)
    } catch (error) {
        res.status(404).send({error:error.message})
    }
}

self.delete = async(req, res) => {    
    try {
        const _id = req.params.id
        const del = await Training.findByIdAndRemove({ _id })
        
        res.status(200).send(del)
    } catch (error) {

        res.status(400).send({error:error.message})
    }
}

self.updateAny = async( req, res) =>{
    try {
        
        const _id = req.params.id
        const update = await Training.updateOne( { _id },{ $set:req.body })
        
        res.status(202).send(update)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}