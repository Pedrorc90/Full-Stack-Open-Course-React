const blogsRoutes = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const userExtractor = async (request, response, next) => {

    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
      if(!token || !decodedToken.id) {
          return response.status(401).json({error: 'Token missing or invalid'})
      }
      request.user = await User.findById(decodedToken.id)
      next()
  }



blogsRoutes.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs);
})

blogsRoutes.get('/:id', async (request, response) => {
    const blogById = await Blog.findById(request.params.id)
    response.send(blogById);
})



blogsRoutes.post('/', userExtractor, async (request, response) => {

    
    const body = request.body;
    const user = request.user;
    const blog = new Blog(body)
    
    blog.likes = (blog.likes) ? blog.likes : 0
    blog.user = user.id

    if (!blog.title && !blog.url) {
        return response.status(400).json( {
            error: 'content missing'
        })
    }
    const newBlog = await blog.save();
    user.blogs = user.blogs.concat(blog.id)
    response.status(201).json(newBlog)
})  


blogsRoutes.put('/:id', async (request, response) => {
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(updatedBlog)
})


blogsRoutes.delete('/:id', userExtractor,  async (request, response) => {

    const user = request.user;
    const blog = await Blog.findById(request.params.id)

    
    if (blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } else {

    }
  
})


  module.exports = blogsRoutes