require('should')
const fs     = require('fs')
const config = require('../src/config')

describe('config', () => {
  const path    = config.getDefaultConfigurationPath()
  const example = path.replace('.yml', '.example.yml')

  describe('#getDefaultConfigurationPath', () => {
    it('should points to the <RootDir>', () => {
      fs.existsSync(example).should.be.true()
    })
  })

  describe('#loadConfig', () => {
    it('should load config.exmaple.yml successfully', () => {
      const cfg = config.loadConfig(example)
      cfg.mac.should.equal('00:00:00:00:00:00')
    })
  })
})
