require('should')
const Payload    = require('../src/payload')
const EchoServer = require('../src/echo-server')

describe('Payload', () => {
  const server = new EchoServer(23333)
  server.listen()

  describe('#reduce', () => {
    it('should yield null', () => {
      const payload = new Payload()
      payload.reduce().should.equal(payload)
    })
  })

  describe('#dump', () => {
    const timestamp = new Date().toJSON()
    it('should returns {}', () => {
      (new Payload().dump())
        .should.deepEqual({})
    })
    it('should attaches timestamp correctly', () => {
      (new Payload().dump(timestamp))
        .should.deepEqual({'timestamp': timestamp})
    })
  })

  describe('#load', () => {
    it('should build an empty Payload object', () => {
      Payload.load(null).should.deepEqual(new Payload())
    })
  })

  describe('#isValid', () => {
    it('should return true', () => {
      new Payload().isValid().should.be.true()
    })
  })

  describe('#equalsTo', () => {
    it('should yell', () => {
      (() => new Payload().equalsTo(null))
        .should.throw('Payload.equalsTo not yet implemented')
    })
  })

  describe('#postTo', () => {
    it('should push {} to the EchoServer', (done) => {
      server.snap = null
      new Payload().postTo(server.fullurl())
        .then(ts => {
          server.snap.timestamp.should.equal(ts)
          done()
        }, err => {
          done(err)
        })
    })
  })

  describe('#buildFrom', () => {
    it('should build from the EchoServer', (done) => {
      server.snap = {timestamp: new Date().toJSON()}
      Payload.buildFrom(server.fullurl())
        .then(payload => {
          payload.timestamp.should.equal(server.snap.timestamp)
          done()
        }, err => {
          done(err)
        })
    })
  })
})
