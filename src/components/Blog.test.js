import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'  // fireEvent liittyy mockolioon
import { prettyDOM } from '@testing-library/dom' // voi testata pienempiä HTML osia
import Blog from './Blog'


test('renders content', () => {
  const blog = {
    title: 'testititle',
    author: 'testiauthor',
    url: 'testiurl',
    likes: '100',
    user: { name: 'pekka' },
  }

  const component = render(
    <Blog blog={blog} />
  )

  component.debug() /// printtaa komponentin html muodossa

  // tapa 1
  expect(component.container).toHaveTextContent(
    'testititle'
  )

  // tapa 1
  expect(component.container).toHaveTextContent(
    'testiauthor'
  )

  /*
  // tapa 2
  const element = component.getByText(
    'testititle'
  )
  expect(element).toBeDefined()

  // tapa 3
  const div = component.container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'testiauthor'
  )
  */

  const divv = component.container.querySelector('div') // ei ollut nyt <li> mitä testata niin kokeillaan diviä. Koko Blog printtaantuu nyt kaks kertaa
  console.log(prettyDOM(divv))
})

test('clicking the button calls event handler once', async () => {
  const blog = {
    title: 'testititle',
    author: 'testiauthor',
    url: 'testiurl',
    likes: '100',
    user: { name: 'pekka' },
  }

  // Tapahtumankäsittelijäksi annetaan Jestin avulla määritelty mock-funktio
  // Mockoliot ja -funktiot ovat testauksessa yleisesti käytettyjä valekomponentteja, 
  // joiden avulla korvataan testattavien komponenttien riippuvuuksia, eli niiden tarvitsemia muita komponentteja.
  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} addLike={mockHandler} />
  )

  // Testi hakee renderöidystä komponentista napin tekstin perusteella ja klikkaa sitä
  const button = component.getByText('like')
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})

test('clicking the button twice calls event handler twice', async () => {
  const blog = {
    title: 'testititle',
    author: 'testiauthor',
    url: 'testiurl',
    likes: '100',
    user: { name: 'pekka' },
  }

  // Tapahtumankäsittelijäksi annetaan Jestin avulla määritelty mock-funktio
  // Mockoliot ja -funktiot ovat testauksessa yleisesti käytettyjä valekomponentteja, 
  // joiden avulla korvataan testattavien komponenttien riippuvuuksia, eli niiden tarvitsemia muita komponentteja.
  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} addLike={mockHandler} />
  )

  // Testi hakee renderöidystä komponentista napin tekstin perusteella ja klikkaa sitä
  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})