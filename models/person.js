const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGO_URI

mongoose.set('strictQuery', false)

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => { console.log('connected to MongoDB') }) // eslint-disable-line no-unused-vars
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message) })

const personSchema = new mongoose.Schema({
    name:{
        type:String,
        minLength:5,
        required:true,
    },
    number:{
        type:String,
        validate:{
            validator: function(v){
                return  /\d{2,3}-\d+$/.test(v)
            },
        },
        minLength:8,
        required:true
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)

