const Article = require('../models/Article')
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
        let article = new Article(req.body)
        article.createdAt = (new Date()).getTime()
        article.lastUpdate = (new Date()).getTime()
        article._owner = req.admin._id

            if(req.files.img){
                const extencionIO = req.files.img.name.split(".");
                const params = {
                    Bucket: config.aws.BUCKET_NAME,
                    Key: "article" +article._id +'.' + extencionIO[extencionIO.length-1],
                    Body: req.files.img.data,
                    ContentType: 'application/' + extencionIO[extencionIO.length-1],
                    ContentEncoding: 'base64',
                    ACL: 'public-read'
                }; 
                // Uploading files to the bucket
                let putObjectPromise = await s3.upload(params).promise();
                article.img = putObjectPromise.Location
            }

        const result = await article.save()

        res.status(201).send(result)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.retrieve = async(req, res) => {    
    try {

        const retrieve = await Article.find({})
        
        res.status(200).send(retrieve)
    } catch (error) {
        res.status(404).send({error:error.message})
    }
}

self.detail = async(req, res) => {    
    try {
        const _id = req.params.id
        const detail = await Article.findOne({_id})

        if(!detail)
            throw new Error('Upss! No se encontró el Elemento')
        
        res.status(200).send(detail)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.updatePicture = async( req, res) =>{
    try {
        const s3  = new aws.S3();
        const _id = req.params.id

            let article = await Article.findOne({_id})

            if(!article)
             throw new Error('Upss! No se encontró el Elemento')

            const extencionIO = req.files.img.name.split(".");
            const params = {
                Bucket: config.aws.BUCKET_NAME,
                Key:  "article" +article._id +'.' + extencionIO[extencionIO.length-1],
                Body: req.files.img.data,
                ContentType: 'application/' + extencionIO[extencionIO.length-1],
                ContentEncoding: 'base64',
                ACL: 'public-read'
            };
        
            // Uploading files to the bucket
            let putObjectPromise = await s3.upload(params).promise();

            article.img = putObjectPromise.Location
            article.lastUpdate = (new Date()).getTime()
            
            const result = await article.save()
        
        
        res.status(202).send(result)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.delArticle = async(req, res) => {    
    
    try {
        const _id = req.params.id
        const del = await Article.findByIdAndRemove({ _id })
        
        res.status(200).send(del)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.updateAny = async( req, res) =>{
    try {
        const _id = req.params.id

            let article = await Article.findOne({_id})

            if(!article)
             throw new Error('Upss! No se encontró el Elemento')    
             
        req.body.lastUpdate = (new Date()).getTime()
             
        const update = await Article.updateOne( { _id },{ $set:req.body })
        
        res.status(202).send(update)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}