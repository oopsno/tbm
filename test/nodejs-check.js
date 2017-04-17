const assert = require('assert')

describe('NodeJS', () => {
  describe('#Version', () => {
    it('it should be 7.9.x or later', () => {
      const [, major, minor] = (/(\d+)\.(\d+)\.(\d+).*/).exec(process.version).map(x => Number.parseInt(x))
      assert.ok(major >= 7)
      assert.ok(minor >= 9)
    })
  })
})
