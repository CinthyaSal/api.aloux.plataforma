const Project = require('../models/Project')
const config = require('../../config')
const self = module.exports;


self.create = async (req, res) => {
    // Create a new Project
    try {
        let project = new Project(req.body)

        project.createdAt = (new Date()).getTime()
        project.lastUpdate = (new Date()).getTime()
        //Asignar el id del admin a la propiedad _owner
        project._owner = req.admin._id
        proj = await project.save()

        res.status(201).send("successfully created")
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.detailOne = async(req, res) => {    
    try {
        const _id = req.params.id
        const detail = await Project.findOne({_id})
        if(!detail)
            throw new Error('Elemento no encontrado, revise sus datos')
        res.status(200).send(detail)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.detailAll = async(req, res) => {    
    try {
        const detail = await Project.find({})
        
        res.status(200).send(detail)
    } catch (error) {
        res.status(404).send({error:error.message})
    }
}

self.remove = async(req, res) => {    
    
    try {
        const _id = req.params.id
        const delproject = await Project.findByIdAndRemove({ _id })
        
        if(!delproject)
            throw new Error('Elemento no encontrado')

        res.status(200).send(delproject)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}
