const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
} else if (process.argv.length < 5 && process.argv.length > 3 ) {
    console.log('Please provide the number as an argument: node mongo.js <password> <name> <number>')
    process.exit(1);
} else if (process.argv.length > 5) {
    console.log('Too many arguments provided. Please provide the password, name, and number as arguments: node mongo.js <password> <name> <number>')
    process.exit(1);
}

console.log('process.argv', process.argv);
const password = process.argv[2];

const url = `mongodb+srv://aryanb349:${password}@fullstackopen.fhhrpdl.mongodb.net/phonebook?retryWrites=true&w=majority&appName=fullstackopen`

mongoose.set('strictQuery', false);

mongoose.connect(url);
console.log('connected to MongoDB');

const personSchema = new mongoose.Schema({ 
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);
if (!process.argv[3] && !process.argv[4]){ 
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
        process.exit(1);
      })
} else if (!process.argv[3] || !process.argv[4]) {
    console.log('Name or number not provided.')
    process.exit(1);
} else {
const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
});

person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}
