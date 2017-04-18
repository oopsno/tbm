require('should')
const Address    = require('../src/address').Address
const EchoServer = require('../src/echo-server')

describe('Address', () => {
  const pair    = {v4: '127.0.0.1', v6: '::1'}
  const address = new Address(pair)
  const server  = new EchoServer(23333)
  server.listen()

  describe('#reduce', () => {
    it('should yield it self', () => {
      address.reduce().should.equal(address)
    })
  })

  describe('#dump', () => {
    const timestamp = new Date().toJSON()
    it('should returns an object', () => {
      address.dump().should.deepEqual({
        v4: address.v4,
        v6: address.v6
      })
    })
    it('should attaches timestamp correctly', () => {
      address.dump(timestamp).should.deepEqual({
        v4:        address.v4,
        v6:        address.v6,
        timestamp: timestamp
      })
    })
  })

  describe('#load', () => {
    it('should build an empty Payload object', () => {
      Address.load(pair).should.deepEqual(address)
    })
  })

  describe('#isValid', () => {
    it('should return true <=> v4 / v6 is valid', () => {
      (new Address()).isValid().should.be.false()
      address.isValid().should.be.true()
    })
  })

  describe('#equalsTo', () => {
    it('should compares v4 / v6', () => {
      address.equalsTo(pair).should.be.true()
      address.equalsTo(address).should.be.true()
      address.equalsTo(null).should.be.false()
      address.equalsTo(42).should.be.false()
      address.equalsTo().should.be.false()
    })
  })

  describe('#postTo', () => {
    it('should push {} to the EchoServer', (done) => {
      server.snap = null
      address.postTo(server.fullurl())
        .then(ts => {
          server.snap.timestamp.should.equal(ts)
          address.equalsTo(server.snap).should.be.true()
          done()
        }, err => {
          done(err)
        })
    })
  })

  describe('#buildFrom', () => {
    it('should build from the EchoServer', (done) => {
      server.snap = pair
      server.snap.timestamp = new Date().toJSON()
      Address.buildFrom(server.fullurl())
        .then(copy => {
          copy.timestamp.should.equal(server.snap.timestamp)
          copy.equalsTo(address).should.be.true()
          done()
        }, err => {
          done(err)
        })
    })
  })
})
