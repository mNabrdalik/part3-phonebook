//express.js
const express = require('express')
const app = express()
const cors = require('cors')
//to parse json in express
app.use(express.json())
app.use(express.static('dist'))

// middleware
const morgan = require('morgan')
app.use(morgan('tiny'))

morgan.token('body', (req) => {
  return JSON.stringify(req.body); // Convert body to a string
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

//cors
app.use(cors())


// app.post('/api/persons', (req, res) => {
//   res.send('POST request received');
// });

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


//http://localhost:3001/api/persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

let requestNumber = 0;

//http://localhost:3001/info
app.get('/info', (request,response) => {
  const dateNow = new Date()
  requestNumber++
  response.send(`<p>Phonebook has info for ${requestNumber} people</p><br><p>${dateNow}</p>`)
})

//http://localhost:3001/api/persons/id
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

//http://localhost:3001/api/persons/id

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter(person => person.id !== id);
  response.status(204).end();
});


//http://localhost:3001/api/persons
app.post('/api/persons', (request, response) => {
  const id = Math.floor(Math.random() * 100000)

  const person = request.body
  
  if (!person.name || !person.number) {
    return response.status(400).json({ 
      error: 'The name or number is missing' 
    })
  }

  if(persons.find(p => p.name === person.name )) {
    return response.status(400).json({ 
      error: 'The name already exists in the phonebook' 
    })
  }



  person.id = String(id)
  persons = persons.concat(person)
  
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})