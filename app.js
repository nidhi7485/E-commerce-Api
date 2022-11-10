require('dotenv').config()
require('express-async-errors')
const express = require('express')

const app = express()

const port = process.env.PORT || 5000

const morgan = require('morgan')

const cookieParser = require('cookie-parser')
// db
const connectDB = require('./db/connect')

// routes
const authRoute = require('./routes/authRoutes')
const userRoute = require('./routes/userRoutes')
// errosMiddleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// middleware
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(morgan('tiny'))
app.use(express.static('./public'))
app.get('/', (req, res) => {
  res.send('e-commerce-api')
})

app.get('/api/v1', (req, res) => {
  // console.log(req.cookies)
  console.log(req.signedCookies)
  res.send('e-commerce-api')
})
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', userRoute)
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
