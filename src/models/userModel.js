const mongoose = require('mongoose')

const customerSchema  = new mongoose.Schema({

    customerName : {
        type :      String,
        trim:       true
    },
    phoneNumber : {
        type : Number,
        required : true,
        trim : true
    },
    password : {
        type : String,
        required : true

    },
   
   
}, {timestamps : true})

module.exports = mongoose.model("Customer", customerSchema)