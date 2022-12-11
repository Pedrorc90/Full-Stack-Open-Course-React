const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRoutes = require('./controllers/blogs')
const usersRoutes = require('./controllers/users')
const loginRouter = require('./controllers/login')


const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())


const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
     request.token = authorization.substring(7)
  }
  next()
}
app.use(tokenExtractor)

app.use('/api/blogs', blogsRoutes)
app.use(usersRoutes)
app.use('/api/login', loginRouter)




module.exports = app