const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const api = supertest(app)
const User = require('../models/user')

const Blog = require('../models/blog')
const initialBlogs = [
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5,
        url: 'www.google.es'
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12,
        url: 'www.google.es'
    },
]

let token = '';
beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('testPwd', 10)
    const user = new User({
        username: 'pedrorc',
        passwordHash
    })
    await user.save()

  const response = await api
    .post('/api/login/')
    .send({
      username: 'pedrorc',
      password: 'testPwd'
    })

    token = response.body.token
})


 test('blogs are returned as json', async () => {
    await api.get('/api/blogs').set('Authorization', token).expect(200).expect('Content-Type', /application\/json/)
})
 

/* test('Unique identifier property is named id', async () => {
   // await api.get('/api/blogs/').expect(200).expect('Content-Type', /application\/json/)

   
}) */



test('Blog can be added and total number is increased by one', async () => {
    const newBlog = {
        title: 'Test',
        author: 'Author Test',
        likes: 10,
        url: 'www.googletest.com'
    }
    await api.post('/api/blogs').set({Authorization: `bearer ${token}`}).send(newBlog).expect(201).expect('Content-Type', /application\/json/)
    const blogs = await Blog.find({})
    const blogsMap = blogs.map( b => b.toJSON())
    expect(blogsMap).toHaveLength(initialBlogs.length + 1)
})

test('likes property set to 0 if is empty', async () => {
    const newBlog = {
        title: 'Test',
        author: 'Author Test',
        url: 'www.googletest.com'
    }
    const newBlogDB = await api.post('/api/blogs').set({Authorization: `bearer ${token}`}).send(newBlog).expect(201).expect('Content-Type', /application\/json/)
    const response = await api.get(`/api/blogs/${newBlogDB.body.id}`)
    const likes = response.body.likes
    expect(likes).toEqual(0) 
})

test('Title and url cannot be empty', async () => {
    const newBlog = {
        author: 'Author Test',
        likes: 10,
    }
    await api.post('/api/blogs').set({Authorization: `bearer ${token}`}).send(newBlog).expect(400)
})


afterAll(() => {
    mongoose.connection.close()
})
