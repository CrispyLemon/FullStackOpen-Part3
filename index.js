const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
// const mongoose = require('mongoose');
app.use(express.static('dist'));
const Person =  require('./models/person')
app.use(morgan('tiny'));
app.use(cors());


morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));



app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
});

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
    res.json(persons)
    })
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
    .catch(error => {
        next(error)
    });
});


// const genID = () => {
//     const maxID = persons.length > 0 
//     ? Math.max(...persons.map(person => person.id))
//     : 0;
//     return maxID + 1;
// }
app.use(bodyParser.json());


app.post('/api/persons', (req, res, next) => {

    const body = req.body;
    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        });
    // } else if (persons.find(p => p.name === body.name)) {
    //     return res.status(400).json({
    //         error: 'name must be unique'
    //     });
    } else if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        });
    }

    const person =  new Person({
        name: body.name,
        number: body.number,
    });
    person.save().then(savedPerson => {
        res.json(savedPerson);
    })
    .catch(error => next(error));    


    
});

app.put('/api/persons/:id', (req, res, next) => {
    const {name, number} = req.body;
    

    Person.findByIdAndUpdate(req.params.id, {name, number}, { new: true, runValidators: true, context: 'query'})
        .then(updatedPerson => {
            res.json(updatedPerson);
        })
        .catch(error => next(error))
    });



app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end();
        })
        .catch(error => next(error))
});

app.get('/info', async (req, res) =>  {
    const personsCount = await Person.countDocuments();
    const date = new Date();
    res.send(`<p>Phonebook has info for ${personsCount} people</p><p>${date}</p>`)
});

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidatorError') {
        return res.status(400).json({ error: error.message })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    next(error)
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}



app.use(unknownEndpoint);
app.use(errorHandler);
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`); 