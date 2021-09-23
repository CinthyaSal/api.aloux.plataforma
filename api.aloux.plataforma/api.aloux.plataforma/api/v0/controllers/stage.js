const Stage = require('../models/Stage')
const config = require('../../config')
const self = module.exports;

self.create = async (req, res) => {
    try {
        const { name, comments, startDate, endDate } = req.body

        const stage = new Stage({ name, comments, startDate, endDate })        
        stage.lastUpdate = (new Date()).getTime()        
        stage._project = req.params.id_project
        const result = await stage.save()

        res.status(201).send(result)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}


self.status  =  async(req, res) => {    
    try {
      
        const _id = req.params.id
        const stage = await Stage.findOne({_id})

        if(!stage)
         throw new Error('Upss! No se encontró el Elemento')

        if(stage.current === true){
            stage.current = false
            stage.lastUpdate = new Date().getTime(); 
        }else {
            stage.current = true
            stage.lastUpdate = new Date().getTime(); 
        }
              
        const result = await stage.save()
        
        res.status(202).send(result)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.updateAny = async( req, res) =>{
    try {
        const { name, comments , startDate, endDate } = req.body

        const _id = req.params.id

            let stage = await Stage.findOne({_id})

            if(!stage)
             throw new Error('Upss! No se encontró el Elemento')        
             
        const update = await Stage.updateOne( { _id },{ $set:{ name, comments , startDate, endDate }, lastUpdate: (new Date()).getTime() })
        
        res.status(202).send(update)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.retrieve = async(req, res) => {    
    try {

        const retrieve = await Stage.find({})
        
        res.status(200).send(retrieve)
    } catch (error) {
        res.status(404).send({error:error.message})
    }
}

self.detail = async(req, res) => {    
    try {
        const _id = req.params.id
        const detail = await Stage.findOne({_id})

        if(!detail)
            throw new Error('Upss! No se encontró el Elemento')
        
        res.status(200).send(detail)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.delStage = async(req, res) => {    
    
    try {
        const _id = req.params.id
        const del = await Stage.findByIdAndRemove({ _id })
        
        res.status(200).send(del)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}