require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()

//init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//init db
require('./dbs/init.mongodb')

//init router
app.use('', require('./routes'))
//handling errors
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  console.log('ee', error.message)
  res.status(statusCode).json({
    success: false,
    code: statusCode,
    langMessage: error.langMessage || null,
    //  stack: error.stack || null,
    message: error.message || 'Internal server error'
  })
})

module.exports = app
