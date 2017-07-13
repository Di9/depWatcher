const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index')

const expect = chai.expect

chai.use(chaiHttp)

describe('Application', () => {
  describe('/', () => {
    it('responds with status 200', (done) => {
      chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
    })
  })
  describe('Show package page', () => {
    it('responds with status 200', (done) => {
      chai.request(app)
      .get('/package/Unitech/pm2')
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
    })
  })
  describe('Wrong package', () => {
    it('responds with status 200', (done) => {
      chai.request(app)
      .get('/package/random/text')
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
    })
  })
  describe('Search form request', () => {
    it('responds with status 200', (done) => {
      chai.request(app)
      .get('/search?form=diwefw/efwe')
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
    })
  })
  describe('Test images output', () => {
    it('request 0-0-0 badge', (done) => {
      chai.request(app)
      .get('/badge/0/0/0.svg')
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
    })
    it('request 3-0-3 badge', (done) => {
      chai.request(app)
      .get('/badge/3/0/3.svg')
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
    })
    it('request 199-23-852 badge', (done) => {
      chai.request(app)
      .get('/badge/199/23/852.svg')
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
    })
  })
})