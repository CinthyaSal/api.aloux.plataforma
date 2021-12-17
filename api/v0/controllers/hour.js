const Hour = require('../models/Hour')
const config = require('../../config')
const self = module.exports;


self.create = async (req, res) => {
    // Create a new Hour
    try {
        let hour = new Hour(req.body)

        hour.createdAt = (new Date()).getTime()
        hour.lastUpdate = (new Date()).getTime()

        await hour.save()

        res.status(201).send("successfully created")
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.detailOne = async(req, res) => {    
    try {
        const _id = req.params.id
        const detail = await Hour.findOne({_id})
        if(!detail)
            throw new Error('Elemento no encontrado, revise sus datos')
        res.status(200).send(detail)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.detailAll = async(req, res) => {    
    try {
        const detail = await Hour.find({})
        
        res.status(200).send(detail)
    } catch (error) {
        res.status(404).send({error:error.message})
    }
}

self.update = async( req, res) =>{
    try {

        const _id = req.params.id
        let hour = await Hour.findOne({_id})
        
        if(!hour)
            throw new Error('Hora no encontrado')        
        req.body.lastUpdate = (new Date()).getTime()

        const update = await Hour.updateOne( { _id },{ $set: req.body })
        console.log(update)
        res.status(202).send(update)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}


self.updateStatus = async( req, res) =>{
    try {

        const _id = req.params.id
        let hour = await Hour.findOne({_id})
        
        if(!hour)
            throw new Error('Hora no encontrado')        
        
        req.body.lastUpdate = (new Date()).getTime()

        hour.paidUp = true
        await hour.save()
        console.log(hour)

        res.status(202).send(hour)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.remove = async(req, res) => {    
    
    try {
        const _id = req.params.id
        const delhour = await Hour.findByIdAndRemove({ _id })
        
        if(!delhour)
            throw new Error('Elemento no encontrado')

        res.status(200).send(delhour)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}
