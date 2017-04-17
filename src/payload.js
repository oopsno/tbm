const _       = require('underscore')
const request = require('request')

function notImplementedError (that, methodName) {
  const className = that.name || Object.getPrototypeOf(that).constructor.name
  return Error(`${className}.${methodName} not yet implemented`)
}

function prejsonify (obj) {
  if (obj instanceof Payload) {
    return obj.dump()
  } else if (_.isString(obj) || _.isNumber(obj) || _.isNull(obj)) {
    return obj
  } else {
    let dummy = {}
    for (const name in obj) {
      if (obj.hasOwnProperty(name)) {
        dummy[name] = prejsonify(obj[name])
      }
    }
  }
}

class Payload {
  reduce () {
    if (this.isValid()) {
      return this
    } else {
      return null
    }
  }

  dump (timestamp = null) {
    let obj = {}
    for (const name in this) {
      if (this.hasOwnProperty(name)) {
        obj[name] = prejsonify(this[name])
      }
    }
    if (timestamp !== null) {
      obj.timestamp = timestamp
    }
    return obj
  }

  static load (obj) {
    return new Payload()
  }

  isValid () {
    return true
  }

  equalsTo (other) {
    throw notImplementedError(this, 'equalsTo')
  }

  async postTo (url) {
    const timestamp = new Date().toJSON()
    const payload   = this.dump(timestamp)
    return new Promise((resolve, reject) => {
      request.post(url).form(payload)
        .on('error', reject)
        .on('response', () => resolve(timestamp))
    })
  }

  static async buildFrom (url) {
    return new Promise((resolve, reject) => {
      request(url, (error, response, data) => {
        if (error) {
          reject(error)
        } else {
          if (_.isString(data)) {
            data = JSON.parse(data)
          }
          let payload = this.load(data)
          if (data.timestamp !== undefined) {
            payload.timestamp = data.timestamp
          }
          resolve(payload)
        }
      })
    })
  }
}

module.exports = Payload
