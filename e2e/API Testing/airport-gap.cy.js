//Token Auth (Positive Case)
describe('[AGTC001] Token Authentification', () => {
  it('Token berhasil didapatkan dengan menginput email & Password yang valid', () => {
    cy.request({
      method: 'POST',
      url: 'https://airportgap.dev-tester.com/api/tokens',
      qs: {
        email: 'farrasnaufalwork@gmail.com',
        password: 'admin123'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('token')
    })
  })
})



//Token Auth (Negative Case)
describe('[AGTC002] Token Auth Tidak Valid', () => {
  it('Token tidak diberikan dengan menginput email & Password yang tidak valid', () => {
    cy.request({
      method: 'POST',
      url: 'https://airportgap.dev-tester.com/api/tokens',
      qs: {
        email: 'inibukanformatemail',
        password: 'ap4aj4b0l3h'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property('errors')
    })
  })
})



//Airport Distances Valid Data (Positive Case)
describe('[AGTC003] Airport Distances API', () => {
  it('Response Status adalah 200, dan Data Respon pada Body API Berhasil Dimunculkan', () => {
    cy.request({
      method: 'POST',
      url: 'https://airportgap.dev-tester.com/api/airports/distance',
      body: {
        from: 'KIX',
        to: 'NRT'
      },
      headers: {
        'Authorization': '97EYi3Qv61E1Cye9mhfT3ahY'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('data')

    const attributes = response.body.data.attributes
      expect(attributes).to.include.keys('kilometers', 'miles', 'nautical_miles')
      expect(attributes.kilometers).to.eq(490.8053652969214)
      expect(attributes.miles).to.eq(304.76001022047103)
      expect(attributes.nautical_miles).to.eq(264.82908133654655)

    })
  })
})



//Airport Distances Invalid Data (Negative Case)
describe('[AGTC004] Invalid Airport Code', () => {
  it('Response Status adalah 422, dan Data Respon pada Body API Tidak Berhasil Dimunculkan karena data kode penerbangan yang tidak valid', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: 'https://airportgap.dev-tester.com/api/airports/distance',
      body: {
        from: 'BDO',
        to: 'JKT'
      },
      headers: {
        'Authorization': '97EYi3Qv61E1Cye9mhfT3ahY'
      }
    }).then((response) => {
      expect(response.status).to.eq(422)
      expect(response.body).to.have.property('errors')

    })
  })
})



//Add Airport to Favorites (Positive)
describe('[AGTC005] Add Airport to Favorites', () => {
  it('Response Status adalah 201, dan Data pada Bandara berhasil ditambah ke Favorit', () => {
    cy.request({
      method: 'POST',
      url: 'https://airportgap.dev-tester.com/api/favorites',
      body: {
        airport_id: 'JFK',
        note: 'Ini untuk post catatan'
      },
      headers: {
        'Authorization': 'Bearer token=97EYi3Qv61E1Cye9mhfT3ahY'
      }
    }).then((response) => {
      const favoriteId = response.body.data.id
      cy.wrap(favoriteId).as('favoriteId')
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('data')
      Cypress.env('favoriteId', favoriteId)
    })
  })
})



//Add Airport to Favorites without Notes (Positive)
describe('[AGTC006] Add Airport to Favorites without Notes', () => {
  it('Response Status adalah 201, dan Data pada Bandara berhasil ditambah ke Favorit walaupun tanpa notes', () => {
    cy.request({
      method: 'POST',
      url: 'https://airportgap.dev-tester.com/api/favorites',
      body: {
        airport_id: 'CDG'
      },
      headers: {
        'Authorization': 'Bearer token=97EYi3Qv61E1Cye9mhfT3ahY'
      }
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('data')

    })
  })
})



//Add Notes to Airports Favorites without Adding Any Aiports to Airport Favorites (Negative)
describe('[AGTC007] Add Notes to Airports Favorites without Adding Any Aiports to Airport Favorites', () => {
  it('Response Status adalah 500, dan Data pada Notes gagal ditambah ke Favorit', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: 'https://airportgap.dev-tester.com/api/favorites',
      body: {
        note: 'POST ini hanya mengirim note saja tanpa Airport_id'
      },
      headers: {
        'Authorization': 'Bearer token=97EYi3Qv61E1Cye9mhfT3ahY'
      }
    }).then((response) => {
      expect(response.status).to.eq(500)
    })
  })
})



//Add Airport to Favorites without Token Authorization (Negative)
describe('[AGTC008] Add Airport to Favorites without Token Authorization', () => {
  it('Response Status adalah 401, dan Data pada Bandara gagal ditambah ke Favorit', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: 'https://airportgap.dev-tester.com/api/favorites',
      body: {
        airport_id: 'JFK',
        note: 'Ini untuk post catatan'
      }
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property('errors')

    })
  })
})



//Get All Data Airport from Favorites (Positive)
describe('[AGTC009] Get All Data Favorited Airport', () => {
  it('Response Status adalah 400, dan Data pada Favorites berhasil di muat', () => {
    cy.request({
      method: 'GET',
      url: 'https://airportgap.dev-tester.com/api/favorites',
      body: {
      },
      headers: {
        'Authorization': 'Bearer token=97EYi3Qv61E1Cye9mhfT3ahY'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('data')

    })
  })
})


//Get Specific Data Airport from Favorites (Positive)
describe('[AGTC010] Get Specific Data Favorited Airport', () => {
  it('Response Status adalah 200, dan Data terperinci Airport pada Favorites berhasil di muat', () => {
    const favoriteId = Cypress.env('favoriteId');
    cy.request({
      method: 'GET',
      url: `https://airportgap.dev-tester.com/api/favorites/${favoriteId}`,
      body: {
      },
      headers: {
        'Authorization': 'Bearer token=97EYi3Qv61E1Cye9mhfT3ahY'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('data')

    })
  })
})



//Update the Airport Data from Favorites (Positive)
describe('[AGTC011] Update the Airport Data from Favorites', () => {
  it('Response Status adalah 200, dan Data terperinci Airport pada Favorites berhasil di muat', () => {
    const favoriteId = Cypress.env('favoriteId');
    cy.request({
      method: 'PATCH',
      url: `https://airportgap.dev-tester.com/api/favorites/${favoriteId}`,
      body: {
        note: 'Ini untuk update catatan'
      },
      headers: {
        'Authorization': 'Bearer token=97EYi3Qv61E1Cye9mhfT3ahY'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('data')

    })
  })
})


//Delete Specific Data Airport from Favorites (Positive)
describe('[AGTC012] Delete Specific Data Favorited Airport', () => {
  it('Response Status adalah 204, dan Data terperinci Airport pada Favorites berhasil dihapus', () => {
    const favoriteId = Cypress.env('favoriteId');
    cy.request({
      method: 'DELETE',
      url: `https://airportgap.dev-tester.com/api/favorites/${favoriteId}`,
      body: {
      },
      headers: {
        'Authorization': 'Bearer token=97EYi3Qv61E1Cye9mhfT3ahY'
      }
    }).then((response) => {
      expect(response.status).to.eq(204)

    })
  })
})



//Delete All Data Airport from Favorites (Positive)
describe('[AGTC013] Delete Delete All Data Favorited Airport', () => {
  it('Response Status adalah 204, dan Seluruh Data Airport pada Favorites berhasil dihapus', () => {
    cy.request({
      method: 'DELETE',
      url: 'https://airportgap.dev-tester.com/api/favorites/clear_all',
      body: {
      },
      headers: {
        'Authorization': 'Bearer token=97EYi3Qv61E1Cye9mhfT3ahY'
      }
    }).then((response) => {
      expect(response.status).to.eq(204)

    })
  })
})
