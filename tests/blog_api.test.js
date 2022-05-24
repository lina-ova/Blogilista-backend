const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('database in general works correctly', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  
  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
  
  test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/blogs')
  
    const likes = response.body.map(r => r.title)
    expect(likes).toContain(
      'wiki'
    )
  })
  
  test('id is there', async () => {
    const response = await api.get('/api/blogs')
    const ids = response.body.map(r => r.id)
    expect(ids).toBeDefined()
  })
})


describe('addind a blog', () => {
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'full',
      url: 'https://fullstackopen.com/osa4/backendin_testaaminen#virheiden-kasittely-ja-async-await',
      likes: 1
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
  
  
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const likes = blogsAtEnd.map(n => n.title)
    expect(likes).toContain(
      'async/await simplifies making async calls'
    )
  })
  
  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'full',
      url: 'https://fullstackopen.com/osa4/backendin_testaaminen#virheiden-kasittely-ja-async-await',
      likes: 1
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
  
  test('blog without likes is added', async () => {
    const newBlog = {
      title: 'little something',
      author: 'someone',
      url: 'https://jestjs.io/docs/expect#tobedefined'
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)
    const likes = blogsAtEnd.map(n => n.likes)
    expect(likes).toContain(
      0
    )
  })
  
  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'little something',
      author: 'someone',
      likes: 4
    }
  
      await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('blog delete', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )
  
    const likes = blogsAtEnd.map(r => r.title)
  
    expect(likes).not.toContain(blogToDelete.title)
  })
  
  test('delete  try of non existing blog', async () => {
    const blogToDelete = helper.nonExistingId()
  
    await api
      .delete(`/api/blogs/${blogToDelete}`)
      .expect(400)
  
    expect(helper.initialBlogs).toHaveLength(
      helper.initialBlogs.length 
    )
  })
})

describe('blog editing', () => {
  test('existing blog can be edited', async () => {
    const blogs = await helper.blogsInDb()
    const blogToEdit = blogs[0]
    const newBlog = {
      title: blogToEdit.title,
      author:blogToEdit.author,
      url: blogToEdit.url,
      likes: blogToEdit.likes + 1
    }
    console.log(blogToEdit.id)
    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .send(newBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    const likes = blogsAtEnd.map(r => r.likes)
  
    expect(likes).toContain(blogToEdit.likes + 1)
  })

  test('non existing blog can not be edited', async () => {
    const blogToEdit = helper.nonExistingId()
    const newBlog = {
      title: 'title tile',
      author:'author',
      url: 'www.url.com',
      likes: 1
    }
    await api 
    .put(`/api/blogs/${blogToEdit.id}`)
    .send(newBlog)
    .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})