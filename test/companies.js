var chai = require('chai')
var expect = chai.expect

const Hubspot = require('..')
const hubspot = new Hubspot({ apiKey: process.env.HUBSPOT_API_KEY || 'demo' })
const _ = require('lodash')

describe('companies', () => {
  describe('get', () => {
    it('should return all companies', () => {
      return hubspot.companies.get().then((data) => {
        expect(data).to.be.an('object')
        expect(data.companies).to.be.a('array')
      })
    })

    it('should return a limited number of companies', () => {
      // you need to run the tests at least 6 times to have enough companies for this test to pass
      return hubspot.companies.get({ limit: 5 }).then((data) => {
        expect(data).to.be.an('object')
        expect(data.companies).to.be.a('array')
        expect(data.companies.length).to.eq(5)
        expect(data['has-more']).to.eq(true)
      })
    })

    it('should return the requested properties', () => {
      return hubspot.companies
        .get({ limit: 5, properties: ['name', 'country', 'city'] })
        .then((data) => {
          expect(data.companies).to.be.a('array')
          expect(data.companies[0].properties.name.value).to.be.a('string')
        })
    })
  })

  describe('getById', () => {
    let companyId

    before(() => {
      return hubspot.companies.get().then((data) => {
        companyId = data.companies[0].companyId
      })
    })

    it('should return a company', () => {
      return hubspot.companies.getById(companyId).then((data) => {
        expect(data).to.be.an('object')
      })
    })
  })

  describe('getRecentlyCreated', () => {
    it('should return recently created companies', () => {
      return hubspot.companies.getRecentlyCreated().then((data) => {
        expect(data).to.be.an('object')
        expect(data.results).to.be.a('array')
      })
    })
  })

  describe('getRecentlyModified', () => {
    it('should return recently modified companies', () => {
      return hubspot.companies.getRecentlyModified().then((data) => {
        expect(data).to.be.an('object')
        expect(data.results).to.be.a('array')
      })
    })
  })

  describe('getByDomain', () => {
    it('should returns a list of all companies that have a matching domain to the specified domain in the request URL', function() {
      this.timeout(10000)
      const payload = {
        limit: 2,
        requestOptions: {
          properties: ['domain', 'createdate', 'name', 'hs_lastmodifieddate'],
        },
        offset: {
          isPrimary: true,
          companyId: 0,
        },
      }
      return hubspot.companies
        .getByDomain('example.com', payload)
        .then((data) => {
          // console.log(data)
          expect(data).to.be.an('object')
          expect(data.results).to.be.an('array')
          expect(data.results[0].properties.domain.value).to.equal(
            'example.com'
          )
        })
    })
  })

  describe('create', () => {
    it('should create a company in a given portal', () => {
      const payload = {
        properties: [
          { name: 'name', value: 'A company name' },
          { name: 'description', value: 'A company description' },
        ],
      }
      return hubspot.companies.create(payload).then((data) => {
        expect(data).to.be.an('object')
        // console.log(data)
        expect(data.properties.name.value).to.equal('A company name')
      })
    })
  })

  describe('delete', () => {
    it('can delete', () => {
      const payload = {
        properties: [
          { name: 'name', value: 'A company name' },
          { name: 'description', value: 'A company description' },
        ],
      }
      return hubspot.companies.create(payload).then((data) => {
        return hubspot.companies.delete(data.companyId)
      })
    })
  })

  describe('getContactIds', () => {
    let companyId

    before(() => {
      return hubspot.companies.get().then((data) => {
        companyId = data.companies[0].companyId
      })
    })

    it('should return a list of contact vids', () => {
      const payload = { count: 10 }
      return hubspot.companies
        .getContactIds(companyId, payload)
        .then((data) => {
          expect(data).to.be.an('object')
          expect(data).to.have.property('vids')
          expect(data).to.have.property('vidOffset')
          expect(data).to.have.property('hasMore')
          expect(data.vids).to.be.an('array')
        })
    })
  })

  describe('getContacts', () => {
    let companyId

    before(() => {
      return hubspot.companies.get().then((data) => {
        companyId = data.companies[0].companyId
      })
    })

    it('should return a list of contact objects', () => {
      const payload = { count: 10 }
      return hubspot.companies.getContacts(companyId, payload).then((data) => {
        expect(data).to.be.an('object')
        expect(data).to.have.property('contacts')
        expect(data).to.have.property('vidOffset')
        expect(data).to.have.property('hasMore')
        expect(data.contacts).to.be.an('array')
      })
    })
  })

  describe('updateBatch', () => {
    let companies

    before(() => {
      return hubspot.companies.get().then((data) => {
        companies = data.companies
      })
    })

    it('should update a batch of company', () => {
      const batch = _.map(companies, (company) => {
        const update = {
          objectId: company.companyId,
          properties: [{ name: 'about_us', value: 'Thumbs up!' }],
        }
        return update
      })
      return hubspot.companies.updateBatch(batch).then((data) => {
        expect(data).to.equal(undefined)
      })
    })
  })

  // describe('addContactToCompany', function () {
  //   it('should add contact to a specific company', function () {
  //     return hubspot.companies.addContactToCompany({ companyId: 322620707, contactVid: 123123 }).then(data => {
  //       expect(data).to.be.an('undefined')
  //     })
  //   })
  // })
})
