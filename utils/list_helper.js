const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0) 
}

const mostLikes = blogs => {
  const reducer = (cur, blog) => {
    if(blog.likes > cur.likes) {
      return {title: blog.title, author: blog.author, likes: blog.likes}
    }
    return cur
  }
   return blogs.length === 0 
    ? null 
    : blogs.reduce(
        reducer,  
        { 
          title: blogs[0].title,
          author:blogs[0].author,
          likes: blogs[0].likes
        }
      )
  
}


module.exports = {
  dummy,
  totalLikes,
  mostLikes
}