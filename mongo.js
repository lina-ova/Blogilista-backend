const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://full-stack:${password}@cluster0.pjr2l.mongodb.net/blogs?retryWrites=true&w=majority`

mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

if(process.argv.length === 3){
  Blog.find({}).then(result => {
    result.forEach(blog => {
      console.log(blog.title, blog.author, blog.url, blog.likes)
    })
    mongoose.connection.close()
  })
} else {
  const title = process.argv[3]
  const author = process.argv[4]
  const url = process.argv[5]
  const likes = process.argv[6]

  const person = new Blog({ title, author, url, likes })

  person.save().then(() => {
    console.log(` added ${title} number ${author} to bloglist`)
    mongoose.connection.close()
  })
}