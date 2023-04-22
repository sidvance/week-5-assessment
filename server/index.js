require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {SERVER_PORT} = process.env
const {seed, getGenres, getBooks, createBook, deleteBook} = require('./controller.js')

app.use(express.json())
app.use(cors())

// DEV
app.post('/seed', seed)

// GENRES
app.get('/genres', getGenres)

// BOOKS
app.post('/books', createBook)
app.get('/books', getBooks)
app.delete('/books/:id', deleteBook)

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))