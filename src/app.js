const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const checkRoute = require('./routes/check')
const connectDB = require('./config/db')
const clientRoutes = require('./routes/clientRoute')

const app = express()

app.use(helmet())
app.use(express.json())

//Routes
app.use('/api', checkRoute)
app.use('/api/clients', clientRoutes)


connectDB()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`YourRateLimiter is running on port ${PORT}`)
})

module.exports = app