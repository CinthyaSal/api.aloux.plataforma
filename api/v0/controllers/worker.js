const Worker = require('../models/Worker')
const aws = require('aws-sdk');
const config = require('../../config')
const self = module.exports;

aws.config.update({
    secretAccessKey: config.aws.secretAccessKey,
    accessKeyId: config.aws.accessKeyId,
    region: config.aws.region
});

self.create = async (req, res) => {
    try {
        const s3  = new aws.S3();
        let worker = new Worker(req.body)
        worker.createdAt = (new Date()).getTime()
        worker.lastUpdate = (new Date()).getTime()        

            if(req.files.img){
                const extencionIO = req.files.img.name.split(".");
                const params = {
                    Bucket: config.aws.BUCKET_NAME,
                    Key: "worker" +worker._id +'.' + extencionIO[extencionIO.length-1],
                    Body: req.files.img.data,
                    ContentType: 'application/' + extencionIO[extencionIO.length-1],
                    ContentEncoding: 'base64',
                    ACL: 'public-read'
                }; 
                // Uploading files to the bucket
                let putObjectPromise = await s3.upload(params).promise();
                worker.img = putObjectPromise.Location
            }

        const result = await worker.save()

        res.status(201).send(result)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.retrieve = async(req, res) => {    
    try {

        const retrieve = await Worker.find({})
        
        res.status(200).send(retrieve)
    } catch (error) {
        res.status(404).send({error:error.message})
    }
}

self.detail = async(req, res) => {    
    try {
        const _id = req.params.id
        const detail = await Worker.findOne({_id})

        if(!detail)
            throw new Error('Upss! No se encontró el Elemento')
        
        res.status(200).send(detail)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.status  =  async(req, res) => {    
    try {
      
        const _id = req.params.id
        const worker = await Worker.findOne({_id})

        if(!worker)
         throw new Error('Upss! No se encontró el Elemento')

        if(worker.isActive === true){
            worker.isActive = false
            worker.lastUpdate = new Date().getTime(); 
        }else {
            worker.isActive = true
            worker.lastUpdate = new Date().getTime(); 
        }
              
        const result = await worker.save()
        
        res.status(202).send(result)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.updateAny = async( req, res) =>{
    try {
        const { name, phone , email } = req.body

        const _id = req.params.id

            let worker = await Worker.findOne({_id})

            if(!worker)
             throw new Error('Upss! No se encontró el Elemento')        
             
        const update = await Worker.updateOne( { _id },{ $set:{ name, phone , email }, lastUpdate: (new Date()).getTime() })
        
        res.status(202).send(update)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.updatePicture = async( req, res) =>{
    try {
        const s3  = new aws.S3();
        const _id = req.params.id

            let worker = await Worker.findOne({_id})

            if(!worker)
             throw new Error('Upss! No se encontró el Elemento')

            const extencionIO = req.files.img.name.split(".");
            const params = {
                Bucket: config.aws.BUCKET_NAME,
                Key:  "worker" +worker._id +'.' + extencionIO[extencionIO.length-1],
                Body: req.files.img.data,
                ContentType: 'application/' + extencionIO[extencionIO.length-1],
                ContentEncoding: 'base64',
                ACL: 'public-read'
            };
        
            // Uploading files to the bucket
            let putObjectPromise = await s3.upload(params).promise();

            worker.img = putObjectPromise.Location
            worker.lastUpdate = (new Date()).getTime()
            
            const result = await worker.save()
        
        
        res.status(202).send(result)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.delWorker = async(req, res) => {    
    
    try {
        const _id = req.params.id
        const del = await Worker.findByIdAndRemove({ _id })
        
        res.status(200).send(del)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}
