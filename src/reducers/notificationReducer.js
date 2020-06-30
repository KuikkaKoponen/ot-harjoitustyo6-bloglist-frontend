
const notificationReducer = (state = '', action) => {

  switch (action.type) {
    case 'FLAG':
      return action.data
    case 'SETNULL':
      return state = ''
    default:
      return state
  }
}

// käytetään async dispatciä
export const setNotification = (content, time) => {
  return async dispatch => {

    dispatch({
      type: 'FLAG',
      data: content,
    })

    const setnull = {
      type: 'SETNULL'
    }

    setTimeout(() => {
      dispatch(setnull)
    }, time*1000)
  }
}

export default notificationReducer