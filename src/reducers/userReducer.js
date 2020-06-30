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
  console.log('POISTa, kirjautunut käyttäjä on' + user)
  blogService.setToken(user.token)
  return async dispatch => {
    dispatch({
      type: 'ADD',
      data: user,
    })
  }
})

export const setNull = () => {
  console.log('Toimii')
  return async dispatch => {
    dispatch({
      type: 'NULL',
      data: '',
    })
  }
}

export default userReducer