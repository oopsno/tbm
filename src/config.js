const fs   = require('fs')
const yml  = require('js-yaml')
const path = require('path')

class Configuration {
  constructor (config) {
    this.mac        = config.mac || null
    this.syncPeriod = config.syncPeriod || 30
  }
}

/**
 * default configuration path
 * returns $PWD/config.yml
 * @return {String}
 */
function getDefaultConfigurationPath () {
  return path.join(process.cwd(), 'config.yml')
}

/**
 * load configuration from yml file
 * @param {String} filename
 * @return {Configuration}
 */
function loadConfig (filename = null) {
  filename     = filename || getDefaultConfigurationPath()
  const text   = fs.readFileSync(filename, {encoding: 'UTF-8'})
  const config = yml.safeLoad(text)
  return new Configuration(config)
}

module.exports.Configuration               = Configuration
module.exports.getDefaultConfigurationPath = getDefaultConfigurationPath
module.exports.loadConfig                  = loadConfig
