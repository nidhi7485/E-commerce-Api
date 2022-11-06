require('dotenv').config()
const express = require('express')

const app = express()

const port = process.env.PORT || 5000

const morgan = require('morgan')
// db
const connectDB = require('./db/connect')

// routes
const authRoute = require('./routes/authRoutes')

// errosMiddleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// middleware
app.use(express.json())
app.use(morgan('tiny'))

app.get('/', (req, res) => {
  res.send('e-commerce-api')
})

app.use('/api/v1/auth', authRoute)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, console.log(`server is listening on port ${port}...`))
  } catch (error) {
    console.log(error)
  }
}
start()
