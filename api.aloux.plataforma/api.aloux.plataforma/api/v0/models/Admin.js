const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("../../config")

const AdminSchema = mongoose.Schema({

    name:           { type: String,  required: true, trim: true },
    createdAt:      { type: Number,  required: true},
    lastUpdate:     { type: Number,  required: false },
    phone:          { type: String,  required: true, trim: true },
    email:          { type: String,  required: true, trim: true, unique: true },
    pwd:            { type: String,  required: true, trim: true },
    isActive:       { type: Boolean, default: true },
    img:            { type: String },
    resetCode:      { type: Number },
    codeVerified:   { type: Boolean, default: false },
    tokens:     [ 
        { 
          token:    { type: String, required: true },
          date:     { type: Number, required: true }
        } 
      ]          
})

AdminSchema.pre("save", async function (next) {
    const admin = this;
  
    if (admin.isModified("pwd")) {
        admin.pwd = await bcrypt.hash(admin.pwd, 8);
    }
  
    next();
  });
  
  AdminSchema.methods.generateAuthToken = async function () {
    const admin = this;
  
    const token = jwt.sign({ _id: admin._id }, config.auth.secret);
    admin.tokens = admin.tokens.concat({ token, date: (new Date().getTime()) });
  
    await admin.save();
  
    return token;
  };
  
  AdminSchema.statics.findByCredentials = async (email, pwd) => {

    try {
      const admin = await Admin.findOne({ email: email });
     
      if (!admin) {  
        throw new Error({ error: "Invalid login credentials" });
      }
      const isPasswordMatch = await bcrypt.compare(pwd, admin.pwd);
      
      if (!isPasswordMatch) {  
        throw new Error({ error: "Invalid login credentials" });
      }
  
      return admin;
    } catch (error) {}
  };
  
const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin