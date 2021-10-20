const Training = require('../models/Training')
const Config = require('../../config')
const aws = require('aws-sdk');

const self = module.exports;

aws.config.update({
    secretAccessKey: Config.aws.secretAccessKey,
    accessKeyId: Config.aws.accessKeyId,
    region: Config.aws.region
});

self.create = async (req, res) => {

    try {
        const s3  = new aws.S3();
        let training = new Training(req.body)
        training.createdAt = (new Date()).getTime()

        if(req.files.cv){
            const extencionIO = req.files.cv.name.split(".");
            const params = {
                Bucket: Config.aws.BUCKET_NAME,
                Key: training.name + '.' + extencionIO[extencionIO.length-1],
                Body: req.files.cv.data,
                ContentType: 'application/' + extencionIO[extencionIO.length-1],
                ContentEncoding: 'base64',
                ACL: 'public-read'
            };
        
            // Uploading files to the bucket
            let putObjectPromise = await s3.upload(params).promise();

            training.urlCv = putObjectPromise.Location
        }
        console.log(training.urlCv)

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