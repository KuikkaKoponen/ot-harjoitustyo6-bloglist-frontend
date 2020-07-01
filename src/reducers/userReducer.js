import blogService from '../services/blogs'

const userReducer = (state = null, action) => {

  switch (action.type) {
  case 'ADD':
    return action.data
  case 'NULL':
    return  null
  default:
    return state
  }
}

export const setUser = (user => {
  blogService.setToken(user.token)
  return async dispatch => {
    dispatch({
      type: 'ADD',
      data: user,
    })
  }
})

export const setNull = () => {
  return async dispatch => {
    dispatch({
      type: 'NULL',
      data: '',
    })
  }
}

export default userReducer