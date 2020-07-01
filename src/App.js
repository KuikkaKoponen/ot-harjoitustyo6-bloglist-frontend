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
import { Table } from 'react-bootstrap'

// Routerilla saadaan helposti sivua jaoteltua osioihin. useParamsin avulla saadaa kavettua id esille osoitteen lopusta
import {
  BrowserRouter as Router,
  Switch, Route, useParams, Link
} from 'react-router-dom'

// käytä tämän työn bäkkärinä ot_harjoitustyo3
const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)

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
      <div>{user.name} logged in</div>
      <button onClick={handleLogOut}>Log out</button>
      <Togglable buttonLabel="Add new blog" ref={noteFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
    </div>
  )

  const showBlogs = () => {
    return (
      <div>
        {bloglist.map(blog =>
          <Blog key={blog.id} blog={blog} addLike={addLike} deleteBlog={deleteBlog} />
        )}
      </div>
    )
  }

  // Tehdään bloggaajista lista (author & julkaisujen määrä)
  const bloggerList= () => {

    var bloggers = []

    // tarkistetaan löytyykö authori jo listalta
    const getIndex = (blog) => {
      return (
        bloggers.findIndex(blogger => blogger.author === blog.author)
      )
    }

    const compareblogs = (a, b) => {
      return b.blogs - a.blogs
    }

    // tallennetaan bloggers listaan author ja blogs tiedot
    bloglist.map(blog =>
      getIndex(blog) > -1 ?
        bloggers = bloggers.map(blogger => blogger.author !== blog.author ? blogger : { ...blogger, blogs: blogger.blogs +1 }).sort(compareblogs) :
        bloggers = bloggers.concat({ id: blog.id, author: blog.author, blogs: 1 })
    )

    return (
      <div>
        <Table striped>
          <thead>
            <tr>
              <th>Blogger</th>
              <th>Blogs</th>
            </tr>
          </thead>
          <tbody>
            {bloggers.map(blogger =>
              <tr key={blogger.id}>
                <td>
                  <Link to={`/blogs/${blogger.id}`}>{blogger.author}</Link>
                </td>
                <td>
                  {blogger.blogs}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    )
  }

  // yhden bloggaajan blogit. // yhden bloggaajan blogit. Tehtiin tästä komponentti koska muuten tuota useParams hookkia ei olisi voinut käyttää
  const BlogsOfBlogger= () => {
    // noudetaan id osoitteen lopusta
    const id = useParams().id
    const author = bloglist.find(blog => blog.id === id).author

    return (
      <div>
        <Table striped>
          <thead>
            <tr>
              <th>Blogs</th>
            </tr>
          </thead>
          <tbody>
            {bloglist.map(blog => blog.author === author ?
              <tr key={blog.id}>
                <td>
                  {blog.title}
                </td>
              </tr>
              : null
            )}
          </tbody>
        </Table>
      </div>
    )
  }

  const padding = {
    padding: 5
  }

  // sivu on jaoteltu eri osiin, joihin pääsee klikkaamalla osiota. Selaimen osoiterivi muuttuu hienosti mukana
  return (
    <div className="container">
      <Notification message={useSelector(state => state.notification)} />
      <Router>
        <div>
          <Link style={padding} to="/">Add new</Link>
          <Link style={padding} to="/blogs">Blogs</Link>
          <Link style={padding} to="/bloggers">Bloggers</Link>
        </div>

        <Switch>
          < Route path="/blogs/:id">
            <BlogsOfBlogger/>
          </Route>
          <Route path="/blogs">
            {user === null ?
              loginForm() : showBlogs()}
          </Route>
          <Route path="/bloggers">
            {user === null ?
              loginForm() : bloggerList() }
          </Route>
          <Route path="/">
            {user === null ?
              loginForm() : blogForm() }
          </Route>
        </Switch>
      </Router>
      <div>
        <i>Hieno blogisivu 2020</i>
      </div>

    </div>
  )
/* vanha tyyli
  return (
    <div className="container">
      <Notification message={useSelector(state => state.notification)} />
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in</p>
          {blogForm()}
          {showBlogs()}
          {bloggerList()}
        </div>
      }
    </div>
  )
 */
}


export default App