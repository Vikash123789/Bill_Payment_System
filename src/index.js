const express = require ('express')
const bodyParser = require('body-parser')
const app = express()
const route = require('../src/routes/route')
const mongoose = require('mongoose')
const multer = require("multer")
app.use(multer().any())

app.use(bodyParser.json())


mongoose.connect("mongodb+srv://priyanka:PriyankaRajput@cluster0.fhqcn.mongodb.net/Bill-Payment?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/' , route)
let port =  3000

app.listen(port, function(){
    console.log(`Express app running on PORT  ${port}`)
})