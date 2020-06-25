describe('Blog ', function() {  // funktio voitaisiin korvata nuolifunktiolla mutta sen käyttöä ei suositella

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'pekkala',
      username: 'pekkala',
      password: 'pekkala'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('Blog site')
    cy.contains('log in')
  })

  it('login form can be opened and login succeeds with correct credentials', function() {
    cy.contains('log in').click()
    cy.get('#username').type('pekkala')
    cy.get('#password').type('pekkala')
    cy.get('#login-button').click()

    cy.contains('pekkala logged in')
  })

  describe('when logged in', function() {
    /*
    beforeEach(function() {
      cy.contains('log in').click()
      cy.get('input:first').type('pekkala')
      cy.get('input:last').type('pekkala')
      cy.get('#login-button').click()
    })
    */

    beforeEach(function() {
      // alla hieno tapa miten hoitaa kirjautuminen. Funktiot löytyy commands luokasta
      cy.login({ username: 'pekkala', password: 'pekkala' })
      cy.createBlog({
        author: 'another note cypress',
        title: 'title',
        url: 'osoite',
        likes: '100'
      })
    })

    it('a new blog can be created', function() {
      cy.contains('Add new blog').click()
      cy.get('.author').type('author created by cypress pekkala')
      cy.get('.title').type('title created by cypress')
      cy.get('.url').type('url created by cypress')
      cy.get('.likes').type('123')
      cy.contains('save').click()
      cy.contains('New blog added')
    })

    it('a blog can be deleted', function() {
      cy.contains('another note cypress').contains('Show more details').click()
      cy.contains('another note cypress').contains('delete').click()
      cy.contains('You have deleted title')
    })

    it('more details can be shown and likes work', function() {
      cy.contains('Show more details').click()
      cy.contains('title')
      cy.contains('100')
      cy.contains('like').click()
      cy.contains('101')
    })

    it('Ketjutus onnistuu', function() {
      cy.contains('Add new blog').click()
      // huom. Komento cy.get etsii elementtejä aina koko sivulta
      cy.get('.author').type('author created by cypress pekkala')
      cy.get('.title').type('title created by cypress')
      cy.get('.url').type('url created by cypress')
      cy.get('.likes').type('123')
      cy.contains('save').click()

      // Ketjutus.Peräkkäin ketjutettuna toisena oleva contains-komento siis jatkaa hakua ensimmäisen komennon löytämän komponentin sisältä
      cy.contains('author created by cypress pekkala').contains('Show more details').click()
      cy.contains('author created by cypress pekkala').contains('like').click()
      cy.contains('author created by cypress pekkala').contains('124')

    })

    // oikean napin löytämiseksi myös 'parent' ja 'as' (toistoa vähemmän) ovat hyödyllisiä
    // ei toimi oikein sovi tähän testiin mutta alla esimerkki
    /* 
    it.only('other of those can be made important', function () {
      cy.contains('second note').parent().find('button').as('theButton')
      cy.get('@theButton').click()
      cy.get('@theButton').should('contain', 'make not important')
    })
    */
    
    // Myös then komennolla saattaa olla käyttöä
    /*
   it('then example', function() {
    cy.get('button').then( buttons => {
      console.log('number of buttons', buttons.length)
      cy.wrap(buttons[0]).click()
    })
    */
  })

  })
  it('login fails with wrong password', function() {
    cy.contains('log in').click()
    cy.get('#username').type('pekkala')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    // kolme eri tapaa tehdä
    cy.get('.error').contains('wrong credentials')
    cy.contains('wrong credentials')
    cy.get('.error')
      .should('contain', 'wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'pekkala logged in')
  })


})