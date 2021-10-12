const Customer = require('../models/Customer')
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
       
        let customer = new Customer(req.body)
        const s3  = new aws.S3();
        customer.createdAt = (new Date()).getTime()
        customer.lastUpdate = (new Date()).getTime()        
        customer._owner = req.admin._id
        
            if(req.files.img){
                const extencionIO = req.files.img.name.split(".");
                const params = {
                    Bucket: config.aws.BUCKET_NAME,
                    Key: "customer" +customer._id +'.' + extencionIO[extencionIO.length-1],
                    Body: req.files.img.data,
                    ContentType: 'application/' + extencionIO[extencionIO.length-1],
                    ContentEncoding: 'base64',
                    ACL: 'public-read'
                }; 
                
                let putObjectPromise = await s3.upload(params).promise();
                customer.img = putObjectPromise.Location
            }

        const result = await customer.save()

        res.status(201).send(result)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.update = async( req, res) =>{
    try {
        const { name, telephone , email, rfc, businessName } = req.body 

        const _id = req.params.id

            let customer = await Customer.findOne({_id})

            if(!customer)
             throw new Error('Cliente no encontrado')        
             
        const update = await Customer.updateOne( { _id },{ $set:{ name, telephone , email, rfc, businessName }, lastUpdate: (new Date()).getTime() })
        
        res.status(202).send(update)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}
self.updateLogo = async( req, res) =>{// revisar
    try {
        const s3  = new aws.S3();
        const _id = req.params.id

            let customer = await Customer.findOne({_id})

            if(!customer)
             throw new Error('No se encontro el cliente')

            const extencionIO = req.files.img.name.split(".");
            const params = {
                Bucket: config.aws.BUCKET_NAME,
                Key:  "customer" +customer._id +'.' + extencionIO[extencionIO.length-1],
                Body: req.files.img.data,
                ContentType: 'application/' + extencionIO[extencionIO.length-1],
                ContentEncoding: 'base64',
                ACL: 'public-read'
            };
        
            // Uploading files to the bucket
            let putObjectPromise = await s3.upload(params).promise();

            customer.img = putObjectPromise.Location
            customer.lastUpdate = (new Date()).getTime()
            
            const result = await customer.save()
        
        
        res.status(202).send(result)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.changeState = async( req, res) =>{
    try {
        const id = req.params.id

        const update = await Customer.findOne( {_id: id })
        update.isActive = false

        await update.save()


        res.status(200).send(update)
    } catch (error) {
        res.status(400).send(error)
    }
}

self.delete = async(req, res) => {    
    
    try {
        const _id = req.params.id
        const elim = await Customer.findByIdAndRemove({ _id })
        
        res.status(200).send(elim)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}
//asignar proyecto
//Listar proyectos

self.updateLogo = async( req, res) =>{
    try {
        const s3  = new aws.S3();
        const _id = req.params.id

            let customer = await Customer.findOne({_id})

            if(!customer)
             throw new Error('Cliente no encontrado')

            const extencionIO = req.files.img.name.split(".");
            const params = {
                Bucket: config.aws.BUCKET_NAME,
                Key:  "customer" +customer._id +'.' + extencionIO[extencionIO.length-1],
                Body: req.files.img.data,
                ContentType: 'application/' + extencionIO[extencionIO.length-1],
                ContentEncoding: 'base64',
                ACL: 'public-read'
            };
        
        
            let putObjectPromise = await s3.upload(params).promise();

            customer.img = putObjectPromise.Location
            customer.lastUpdate = (new Date()).getTime()
            
            const result = await customer.save()
        
        
        res.status(202).send(result)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}