//Huvudfil för express

const express = require ('express')
const authRoutes = require('./Routes/auth_routes')
const app = express ()
const helmet = require('helmet')

app.use(helmet())
app.use(express.json())
app.use('/api/auth', authRoutes)


module.exports = app