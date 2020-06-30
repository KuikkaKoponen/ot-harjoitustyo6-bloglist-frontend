import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [newBlogLikes, setNewBlogLikes] = useState('')

  const handleBlogTitleChange = (event) => {
    setNewBlogTitle(event.target.value)
  }

  const handleBlogAuthorChange = (event) => {
    setNewBlogAuthor(event.target.value)
  }

  const handleBlogUrlChange = (event) => {
    setNewBlogUrl(event.target.value)
  }

  const handleBlogLikesChange = (event) => {
    setNewBlogLikes(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
      likes: newBlogLikes,
    })

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
    setNewBlogLikes('')
  }

  return (
    <div className="formDiv">
      <h2>Add blog</h2>

      <form onSubmit={addBlog}>
         Author
        <input className="author"
          value={newBlogAuthor}
          onChange={handleBlogAuthorChange}
        /> <br></br>
        Title
        <input className="title"
          value={newBlogTitle}
          onChange={handleBlogTitleChange}
        /> <br></br>
        Url
        <input className="url"
          value={newBlogUrl}
          onChange={handleBlogUrlChange}
        /> <br></br>
        Likes
        <input className="likes"
          value={newBlogLikes}
          onChange={handleBlogLikesChange}/> <br></br>
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm