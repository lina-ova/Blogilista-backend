const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'wiki',
    author: 'unknown',
    url: 'https://www.wikipedia.org/',
    likes: 4
  },
  {
    title: 'ficbook',
    author: 'guys',
    url: "https://ficbook.net/",
    likes: 10
  },
]

const nonExistingId = async () => {
  const note = new Blog({
    title: 'youtube',
    author: 'Tube',
    url: "https://www.youtube.com/",
    likes: 1000})
  await note.save()
  await note.remove()

  return note._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}