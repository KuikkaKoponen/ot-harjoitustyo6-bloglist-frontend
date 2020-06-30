import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import loginService from './services/login'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeblogs, createBlog, createLike, removeBlog } from './reducers/blogsReducer'
import { setUser, setNull } from './reducers/userReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)

  // käytin nyt useStatea. Olisi voinut käyttää reduxia
  const [bloggers, setbloggers] = useState('')

  const bloglist = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeblogs())
  },[dispatch])

  // mikäli käyttäjä on kirjautunut asetetaan storeen käyttäjän tiedot
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
    }
  }, [dispatch])

  // notifikaatio omalla messagella
  const Notification = ({ message }) => {
    if (message === '') {
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
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('wrong credentials', 5))
    }
  }

  const handleLogOut = async () => {
    try {
      window.localStorage.removeItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      dispatch(setNull())
      window.location.reload(false)
    } catch (exception) {
      dispatch(setNotification('logout failed', 5))
    }
  }

  // addBlog funktio heitetään BlogFormille
  // TODO: virheilmoitus jos tietokantaan tallennus epäonnistuu, esim. liian vähän merkkejä
  const addBlog = (blogObject) => {
    noteFormRef.current.toggleVisibility() // kutsutaan reffin toggleVisibilitiä. Piilotetaan addblog form
    dispatch(createBlog(blogObject))
    dispatch(setNotification(`${blogObject.author} added`, 5))
  }

  /// toimii
  const addLike = (blogObject) => {
    dispatch(createLike(blogObject))
    dispatch(setNotification(`You have liked ${blogObject.title}`, 5))

  }

  /// toimii
  const deleteBlog = (blogObject) => {
    if (window.confirm(`Do you really want delete ${blogObject.title}?`)) {
      dispatch(removeBlog(blogObject))
      dispatch(setNotification(`You have deleted ${blogObject.title}`, 5))
    }
  }

  const noteFormRef = React.createRef()  // luodaan reffi. Se välitetään Togglablen useImperativeHandlelle, jota sitten kutsutaan
  // eli reffin avulla voidaan kutsua komponenttien sisällä olevia funktioita ulkopuolella olevista funtioista kuten nyt yllä olevasta addBlogista

  const blogForm = () => (
    <div>
      <button onClick={handleLogOut}>Log out</button>
      <Togglable buttonLabel="Add new blog" ref={noteFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
    </div>
  )

  const showBlogs = (bloglist) => {
    return (
      <div>
        <h2>blogs</h2>
        {bloglist.map(blog =>
          <Blog key={blog.id} blog={blog} addLike={addLike} deleteBlog={deleteBlog} />
        )}
      </div>
    )
  }
  // jatka tästä!
  /*
  const bloggers = (bloglist) => {
    {bloglist.map(blog => 
      if (bloggers.findIndex(blog => blog.author === author) < -1) {

      } 

    return (
      <div>
        <h2>Users</h2>
        {bloglist.map(blog =>
          <Blog key={blog.id} blog={blog} addLike={addLike} deleteBlog={deleteBlog} />
        )}
      </div>
    )
  }

    */   


  return (
    <div className="container">
      <h2>Blog site</h2>
      <Notification message={useSelector(state => state.notification)} />
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in</p>
          {blogForm()}
        </div>
      }

      {user === null ?
        <div></div> :
        showBlogs(bloglist)
      }
    </div>
  )
}

export default App