import blogService from '../services/blogs'

const reducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
  case 'CREATE':
    return state.concat(action.data).sort(compareLikes)
  case 'INIT_BLOGS':
    return action.data.sort(compareLikes)
  case 'LIKE':
    const id = action.data.id
    const blogToChange = state.find(n => n.id === id)
    const changedBlog = { 
      ...blogToChange, 
      likes: action.data.likes
    }
    return state.map(anec =>
      anec.id !== id ? anec : changedBlog
    ).sort(compareLikes)
  case 'REMOVE':
    const userId = action.data.id
    return state.filter(n => n.id !== userId).sort(compareLikes)
  default: return state
  }
}

const compareLikes = (a, b) => {
  return b.likes - a.likes
}

// uusi tapa, kaikki hoituu täällä
export const initializeblogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    })
  }
}

// uusi tapa, kaikki hoituu täällä
export const createBlog = (content) => {
  console.log('luodaan uusi blogi' + content)
  return async dispatch => {
    const newAnec = await blogService.create(content)
    dispatch({
      type: 'CREATE',
      data: newAnec
    })
  }
}

export const createLike = (blogObject) => {
  const liked = { ...blogObject, likes: blogObject.likes +1 } // muista tämä tapa kopioida ja muokata!
  return async dispatch => {
    const updated = await blogService.update(liked.id, liked)
    dispatch({
      type: 'LIKE',
      data: updated,
    })
  }
}

export const removeBlog = (blogObject) => {
  return async dispatch => {
    await blogService.remove(blogObject.id)
    dispatch({
      type: 'REMOVE',
      data: blogObject,
    })
  }
}

export default reducer