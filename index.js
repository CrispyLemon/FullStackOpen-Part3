const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
app.use(express.static('dist'));
app.use(express.json());
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
        res.json(persons);
    })
    .catch(error => {
        console.log(error);
        res.status(500).end()
    });
});

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        if ( person ){
        res.json(person);
        } else {
            res.status(404).end();
        }
    })
    .catch(error => {
        console.log(error);
        res.status(400).send({ error: 'malformatted id' })
    });
    
});



app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        });
    } else if (persons.find(p => p.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        });
    } else if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        });
    }
    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then(result => {
        console.log('person saved!');
    })

    res.json(person);
    
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
});

app.get('/info', (req, res) => {
    const personsCount = persons.length;
    const date = new Date();
    res.send(`<p>Phonebook has info for ${personsCount} people</p><p>${date}</p>`)
});


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`); 