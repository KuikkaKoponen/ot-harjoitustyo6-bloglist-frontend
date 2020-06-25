import React from 'react'
import Togglable from './Togglable'

const Blog = ({ blog, addLike, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
}

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} <br></br>
      {blog.author} <br></br>
      <Togglable buttonLabel="Show more details">
        {blog.url} <br></br>
        {blog.likes}
        <button onClick={() => addLike(blog)} >like</button> <br></br>
        <button onClick={() => deleteBlog(blog)} >delete</button> <br></br>
      </Togglable>
    </div>
  )
}
export default Blog
