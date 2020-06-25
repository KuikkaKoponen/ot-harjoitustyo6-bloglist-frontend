import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const input = component.container.querySelector('input') // viittaa <input> koska monta inputtia niin valitsee ensimmäisen
  const author = component.container.querySelector('.title') // viitataan className="author"
  const url = component.container.querySelector('.url')
  const likes = component.container.querySelector('.likes')
  const form = component.container.querySelector('form')   // viittaa <form>

  fireEvent.change(input, {
    target: { value: 'testing of forms could be easier' }
  })
  fireEvent.change(author, {
    target: { value: 'tekija' }
  })
  fireEvent.change(url, {
    target: { value: 'osoite' }
  })
  fireEvent.change(likes, {
    target: { value: '1000' }
  })
  fireEvent.submit(form)

  console.log('oma printti', createBlog.mock.calls)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing of forms could be easier' )
  expect(createBlog.mock.calls[0][0].author).toBe('tekija' )
  expect(createBlog.mock.calls[0][0].url).toBe('osoite' )
  expect(createBlog.mock.calls[0][0].likes).toBe('1000' )
})