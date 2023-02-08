require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()

// Setup your Middleware and API Router here
app.use(cors())

const apiRouter = require('./api')
app.use('/api', apiRouter)

module.exports = app;
