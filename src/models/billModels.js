const mongoose = require('mongoose')

const billSchema = new mongoose.Schema({
    
    customerName : String,
    meterNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    units: {
        type: Number,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true

    },
    lastDate: Date,
    status : {
        type : String,
        default : 'Pending'
    }



}, { timestamps: true })

module.exports = mongoose.model("Bill", billSchema)