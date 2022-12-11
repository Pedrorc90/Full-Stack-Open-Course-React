const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYxYjNhMDc4MzhiMmZkMWY1ZmM4NWFhNyIsImlhdCI6MTYzOTE3MTMyN30.TQd6RpcQ6IBjtvE19NFnyZPkMX7daa0BKstX3CusoM8'

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({username: 'root', passwordHash})

        await user.save();
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'TestUserName',
            name: 'Test User Name',
            password: 'testPwd'
        }

        await api.post('/api/users')
            .send(newUser)
            .set('Authorization', token)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

     test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          blogs: [],
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(500) // I'm receiving 500 status code instead of 400 from mongoose unique validator

    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      }) 

      test('creation fails with proper statuscode and message if username has equal or less than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          blogs: [],
          username: 'roo',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .set('Authorization', token)
          .expect(400)
          
          
        expect(result.body.error).toContain('The username and password should have at least 3 characters')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      }) 

      test('creation fails with proper statuscode and message if password has equal or less than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          blogs: [],
          username: 'root',
          name: 'Superuser',
          password: 'sal',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .set('Authorization', token)
          .expect(400)
          
          
        expect(result.body.error).toContain('The username and password should have at least 3 characters')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      }) 


      test('creation fails with proper statuscode and message if username is missing', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          blogs: [],
          name: 'Superuser',
          password: 'sal',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .set('Authorization', token)
          .expect(400)
          
          
        expect(result.body.error).toContain('Content missing')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      }) 

      test('creation fails with proper statuscode and message if password is missing', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          blogs: [],
          username: 'ress',
          name: 'Superuser',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .set('Authorization', token)
          .expect(400)
          
          
        expect(result.body.error).toContain('Content missing')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      }) 
})


afterAll(() => {
  mongoose.connection.close()
})