const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')
const middleware = require("../utils/middleware").userExtractor

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', {username:1, name: 1})

  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const  { body } = request
   
  const user = request.user

  const blog = new Blog({ 
    title:body.title, 
    author: body.author, 
    url:body.url, 
    likes: body.likes || 0,
    user: user._id 
  })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
 const { id } = request.params


  const user = request.user
  const blog = await Blog.findById(id)
  
  if (!blog || !user) return response.status(404).end();

  const belongsToUser = blog.user.toString() === user._id.toString();
    if (belongsToUser) {
      await Blog.findByIdAndRemove(id)

      user.blogs = user.blogs.filter(blogIn  => blogIn.toString()!== blog._id.toString())
      await user.save()

      return response.status(204).end();
    } else {
      return response.status(403).json({error: 'User don`t have rights to delete this blog'})
    }
   
  
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title:body.title, 
    author: body.author, 
    url:body.url, 
    likes: body.likes || 0 
  }

  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

  response.status(201).end()
})

module.exports = blogsRouter