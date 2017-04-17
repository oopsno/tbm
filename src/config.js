const fs = require('fs')
const yml = require('js-yaml')
const path = require('path')

function loadConfig (filename) {
  if (filename === undefined) {
    filename = path.join(process.cwd(), 'config.yml')
  }
  const text = fs.readFileSync(filename, {encoding: 'UTF-8'})
  return yml.safeLoad(text)
}

module.exports = loadConfig
