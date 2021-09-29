const Admin = require('../models/Admin')
const self = module.exports;
const axios = require('axios');
const aws = require('aws-sdk');
const config = require('../../config');

aws.config.update({
    secretAccessKey: config.aws.secretAccessKey,
    accessKeyId: config.aws.accessKeyId,
    region: config.aws.region
});

self.signup = async (req, res) => {
    try {

        const result = await Admin.findOne({email: req.body.email})
        if(result)
        res.status(409).send({error: 'El usuario con el correo '+ req.body.email +', ya existe'})
        let admin = new Admin(req.body)
        admin.createdAt = (new Date()).getTime()
        admin.lastUpdate = (new Date()).getTime()


        await admin.save()
        const token = await admin.generateAuthToken()
        delete admin.pwd

        res.status(201).send({token: token})
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.login  =  async(req, res) => {
    try {
        const { email, pwd } = req.body

        const adminLogin = await Admin.findByCredentials(email, pwd)

        if (!adminLogin) {
            return res.status(401).send({
                error: 'Credenciales incorrectas',
                suggestion: 'Verifica que el User y Contraseña sean correctas'
            })
        }
        if(!adminLogin.isActive){
            return res.status(401).send({
                error: 'User inactivo',
                suggestion: 'Pongase en contacto con soporte'
            })
        }
        else{
            const token = await adminLogin.generateAuthToken()
            res.status(200).send({token})
        }

    } catch (error) {
        res.status(500).send(error)
    }
}

self.logout = async (req, res) => {
    try {
        const admin = await Admin.findOne({_id:req.admin._id})
        admin.tokens = admin.tokens.filter((token) => {
            return token.token != req.token
        })
        
        await admin.save()
        
        res.status(200).send()
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

self.retrieve = async(req, res) => {    
    try {

        const retrieve = await Admin.find({})
        
        res.status(200).send(retrieve)
    } catch (error) {
        res.status(404).send({error:error.message})
    }
}

self.me  =  async(req, res) => {
    res.status(200).send(req.admin)
}

self.detail = async(req, res) => {    
    try {
        const _id = req.params.id
        const detail = await Admin.findOne({_id})

        if(!detail)
            throw new Error('Upss! No se encontró el Elemento')
        
        res.status(200).send(detail)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.updateAny = async( req, res) =>{
    try {
        const { email, name , phone } = req.body
        const _id = req.admin._id
        const update = await Admin.updateOne( { _id },{ $set:{ email, name , phone }, lastUpdate: (new Date()).getTime() })
        
        res.status(202).send(update)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.updatePicture = async( req, res) =>{
    try {
        const s3  = new aws.S3();
        const _id = req.admin._id

            let admin = await Admin.findOne({_id})

            if(!admin)
             throw new Error('Upss! No se encontró el Elemento')

            const extencionIO = req.files.img.name.split(".");
            const params = {
                Bucket: config.aws.BUCKET_NAME,
                Key: 'admin' + admin._id +'.' + extencionIO[extencionIO.length-1],
                Body: req.files.img.data,
                ContentType: 'application/' + extencionIO[extencionIO.length-1],
                ContentEncoding: 'base64',
                ACL: 'public-read'
            };
        
            // Uploading files to the bucket
            let putObjectPromise = await s3.upload(params).promise();

            admin.img = putObjectPromise.Location
            admin.lastUpdate = (new Date()).getTime()
            
            const result = await admin.save()
        
        
        res.status(202).send(result)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.status  =  async(req, res) => {    
    try {
      
        const _id = req.params.id
        const admin = await Admin.findOne({_id})

        if(!admin)
         throw new Error('Upss! No se encontró el Elemento')

        if(admin.isActive === true){
            admin.isActive = false
            admin.lastUpdate = new Date().getTime(); 
        }else {
            admin.isActive = true
            admin.lastUpdate = new Date().getTime(); 
        }
              
        const result = await admin.save()
        
        res.status(202).send(result)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

self.delAdmin = async(req, res) => {    
    
    try {
        const _id = req.params.id
        const del = await Admin.findByIdAndRemove({ _id })
        
        res.status(200).send(del)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}


self.generatecode = async () => {
    let code = "";
    let random = [];

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }
    function isReapeat(arr, value) {
        for(let i in arr){
            if(arr[i].nivel === value){
                return true
            }
        }
        return false
    }

    function getRandom(){
        const nivel = getRandomArbitrary(0,10);
        if(!isReapeat(random, nivel)){
            random.push({ nivel : nivel });
        }
        if(random.length < 4){
            getRandom()
        }
    }

    getRandom()

    for(let i in random){
        code += random[i].nivel;
    }

    return code;
}

self.recoverpassword = async (req, res) => {
    try {
        const correo = req.body.email
        var body = JSON.parse(JSON.stringify(req.body));

        const user = await Admin.findOne({email: correo});
        if (!user) {
            return res.status(409).send({error: 'User no encontrado.'});
        }

        const code = await self.generatecode();
        
        const sendcode = await self.sendcodemail(correo, code);
        
        user.resetCode = code;

        await user.save();

        res.status(200).send();
    } catch (error) {
        res.status(500).send('Error al envíar el correo electronico')
        console.log(error)
    }
}

self.sendcodemail = async( correo, code) =>{
    try {
        statusCode = 200;

        var postData = {
            subscriber: correo,
            form: [
                { key:"Codigo", val: code }
            ],
            title: "Código"
        };

        
        let axiosConfig = {
            headers: {
                'Authorization': config.email.token,
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };
        
        let resp = await axios.post(config.email.api, postData, axiosConfig);

        if(resp.status === 201){
            return 'ok';
        }
        else{  
            statusCode = 500;
            throw new Error('Ocurrio un error al envìar el correo electronico')
        }        
    } catch (error) {
        throw new Error('Ocurrio un error al envìar el correo electronico');
    }
}


self.verifyCode = async (req, res) => {
    try {
        const correo = req.body.email
        var body = JSON.parse(JSON.stringify(req.body));

        const user = await Admin.findOne({ email: correo } );

        if (!user) {
            return res.status(409).send({error: 'No se pudo validar la información.'});
        }

        if(user.resetCode == null)
            return res.status(409).send({error: 'El código ha caducado.'});

        if(user.resetCode == body.resetCode)
        {
            user.resetCode = null;
            user.codeVerified = true;

            await user.save();
        }
        else 
            return res.status(409).send('Código incorrecto.');


        res.status(200).send();
    } catch (error) {
        res.status(400).send(error)
    }
}

self.resetPassword  =  async(req, res) => {    
    try {
        let correo = req.body.email;
        var body = JSON.parse(JSON.stringify(req.body));

        const usuario = await Admin.findOne({ email: correo } )

        if (!usuario) {
            return res.status(409).send({error: 'User no encontrado.'})
        }

        if(usuario.codeVerified)
        {
            usuario.pwd = body.pwd;
            usuario.codeVerified = false;
            usuario.lastUpdate = new Date().getTime();
            usuario.tokens = []

            await usuario.save()

            const token = await usuario.generateAuthToken()
            res.status(200).send({token})
        }
        else{
            return res.status(401).send("El codigo no ha sido verificado");
        }

    } catch (error) {
        res.status(400).send(error)
    }
}

self.updatePass  =  async(req, res) => {
    try {       

        const usuario = await Admin.findOne({_id: req.admin._id} )
        
        if (usuario) {
           
            usuario.pwd = req.body.pwd            
            usuario.lastUpdate = new Date().getTime();                        
            await usuario.save()
            
            res.status(200).send("password updated successfully");  
        } else return res.status(409).send({error: 'Usuario no encontrado.'})     
     
    } catch (error) {
        res.status(400).send(error)
    }
}