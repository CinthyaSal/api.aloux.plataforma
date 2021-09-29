const mongoose = require('mongoose')
const config = require("../../config")
const { ObjectId } = require('mongodb')

const ProjectSchema = mongoose.Schema({
    name:               { type: String, required: true },
    createdAt:          { type: Number, required: true },
    lastUpdate:         { type: Number, required: true },
    _owner:             { type: ObjectId, ref: 'Admin' },
    notes:              { type: String, required: false},
    _idCliente:         { type: ObjectId, required: false },
    costGross :         { type: Number, required: true },
    netCost:            { type: Number, required: false },
    startDate:          { type: Number, required: false },
    deploymentDate:     { type: Number, required: false },
    testDate:           { type: Number, required: false },
    schemePayments:     [{
                            _payments :{type: ObjectId, ref: 'Payments'},
                            cantidad: {type: Number, default : 1 }
                        }],
    totalHours:         { type: Number, required: true },
    typeArchitecture:   { type: String, required: true }

})

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project