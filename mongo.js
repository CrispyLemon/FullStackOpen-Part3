const mongoose = require('mongoose')
if (process.argv.length > 5) {
    console.log('Too many arguments')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://aryanb349:${password}@fullstackopen.fhhrpdl.mongodb.net/phonebook?retryWrites=true&w=majority&appName=fullstackopen`

mongoose.set('strictQuery', false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
    name:String,
    number:String,
})
const Person = mongoose.model('Person', personSchema)



if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
} else if (process.argv.length === 4) {
    console.log('Name or number is missing. Please provide both name and number as arguments: node mongo.js <password> <name> <number>')
    process.exit(1)
} else if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}



