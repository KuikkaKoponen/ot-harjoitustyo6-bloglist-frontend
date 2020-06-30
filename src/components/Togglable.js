import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

// togglablen props.chindren sisään voi tunkea monta eri komponenttia, esim. BlogFormin
const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  // Käyttämämme useImperativeHandle on siis React hook, jonka avulla funktiona määritellylle komponentille voidaan määrittää funktioita, joita on mahdollista kutsua sen ulkopuolelta.
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  // nappi omalla tekstillä joka piilottaa ja näyttää omat kentät, jotka annettu props.childrenissä
  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {props.children}
        <button onClick={toggleVisibility}>hide</button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

// prop typesin avulla voidaan määritellä tietyt propsit pakolliseksi
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable