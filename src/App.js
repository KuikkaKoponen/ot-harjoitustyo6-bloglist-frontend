import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort(compareLikes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
    return (
      <div className="error">
        {message}
      </div>
    )
  }

  const loginForm = () => {
    // loginform tehty ilman ToggleLogin avustusta, voitasiin ihan hyvin heittää LoginForm sen sisään, sama lopputulos
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>hide login</button>
        </div>
      </div>
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogOut = async () => {
    try {
      window.localStorage.removeItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      window.location.reload(false); 
    } catch (exception) {
      setErrorMessage('logout failed')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  // addBlog funktio heitetään BlogFormille 
  const addBlog = (blogObject) => {
    noteFormRef.current.toggleVisibility() // kutsutaan reffin toggleVisibilitiä. Piilotetaan addblog form
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog).sort(compareLikes))
        setErrorMessage(
          'New blog added'
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)

      }).catch(error => {
        console.log(error.message)
        setErrorMessage(
          'Error when  adding new blog'
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  /// toimii
  const addLike = (blogObject) => {
    const update = {
      user: blogObject.user._id,
      likes: blogObject.likes + 1,
      author: blogObject.author,
      title: blogObject.title,
      url: blogObject.url
    }
    blogService
      .update(blogObject.id, update)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== returnedBlog.id ? blog : returnedBlog).sort(compareLikes))
        setErrorMessage(`You have liked ${returnedBlog.title}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)

      }).catch(error => {
        console.log(error.message)
        setErrorMessage(
          'Error when updating blog'
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  /// toimii
  const deleteBlog = (blogObject) => {
    if (window.confirm(`Do you really want delete ${blogObject.title}?`)) {
      blogService
        .remove(blogObject.id)
        .then(returnedBlog => {
          setBlogs(blogs.filter(blog => blog.id !== blogObject.id).sort(compareLikes))
          setErrorMessage(`You have deleted ${blogObject.title}`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)

        }).catch(error => {
          console.log(error.message)
          setErrorMessage(
            'Only own blog can be deleted'
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const noteFormRef = React.createRef()  // luodaan reffi. Se välitetään Togglablen useImperativeHandlelle, jota sitten kutsutaan

  const blogForm = () => (
    <div>
      <button onClick={handleLogOut}>Log out</button>
      <Togglable buttonLabel="Add new blog" ref={noteFormRef}> 
        <BlogForm createBlog={addBlog}/>
      </Togglable>
    </div>
  )

  const compareLikes = (a, b) => {
    return a.likes - b.likes
  }

  const showBlogs = () => (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} addLike={addLike} deleteBlog={deleteBlog} />
      )}
    </div>
  )

  return (
    <div>
      <h2>Blog site</h2>
      <Notification message={errorMessage} />
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in</p>
          {blogForm()}
        </div>
      }

      {user === null ?
        <div></div> :
        showBlogs()
      }
    </div>
  )
}

export default App