const Stage = require('../models/Stage')
const config = require('../../config')
const self = module.exports;

self.create = async (req, res) => {
    try {
        const { name, comments, startDate, endDate } = req.body

        const stage = new Stage({ name, comments, startDate, endDate })        
        stage.lastUpdate = (new Date()).getTime()
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


self.retrieve = async(req, res) => {    
    try {

        const retrieve = await Stage.find({})
        
        res.status(200).send(retrieve)
    } catch (error) {
        res.status(404).send({error:error.message})
    }
}
