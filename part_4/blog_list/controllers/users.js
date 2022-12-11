const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/api/users', async (request, response) => {
  const users = await User.find({}).populate('blogs', {title: 1})
  response.json(users)
})

usersRouter.post('/api/users', async (request, response) => {
    const body = request.body

  

    if(!body.username || !body.password) {
      return response.status(400).json({
        error: 'Content missing'
      })
    } 

     if(body.username.length <= 3 || body.password.length <= 3) {
      return response.status(400).json({
        error: 'The username and password should have at least 3 characters'
      })
    }  


    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
  
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })
  
    const savedUser = await user.save()
  
    response.json(savedUser)
  })
  
  module.exports = usersRouter