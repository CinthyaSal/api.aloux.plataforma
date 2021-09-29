const Postbox = require('../models/Postbox')
const Config = require('../../config')

const self = module.exports;


self.create = async (req, res) => {

    try {
        let postbox = new Postbox(req.body)
        
        await postbox.save()
        
        res.status(201).send(postbox)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.retrieve = async(req, res) => {    
    try {

        const retrieve = await Postbox.find({})
        
        res.status(200).send(retrieve)
    } catch (error) {
        res.status(404).send({error:error.message})
    }
}

self.delete = async(req, res) => {    
    try {
        const _id = req.params.id
        const del = await Postbox.findByIdAndRemove({ _id })
        
        res.status(200).send(del)
    } catch (error) {

        res.status(400).send({error:error.message})
    }
}

self.updateAny = async( req, res) =>{
    try {
        
        const _id = req.params.id
        const update = await Postbox.updateOne( { _id },{ $set:req.body })
        
        res.status(202).send(update)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}
