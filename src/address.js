const os      = require('os')
const net     = require('net')
const Payload = require('./payload')

class Address extends Payload {
  constructor (address = null) {
    super()
    this.v4 = null
    this.v6 = null
    if (address !== null && address.v4 && address.v6) {
      this.v4 = address.v4
      this.v6 = address.v6
    }
  }

  static load (obj) {
    let address = new Address(obj)
    for (const name in address) {
      if (address.hasOwnProperty(name) && obj.hasOwnProperty(name)) {
        address[name] = obj[name]
      }
    }
    return address
  }

  isValid () {
    return net.isIPv4(this.v4) || net.isIPv6(this.v6)
  }

  equalsTo (other) {
    return Boolean(other && this.v4 === other.v4 && this.v6 === other.v6)
  }
}

/**
 * get IPv4 Address for specified interface
 * @param {Configuration} config
 * @return {Address}
 */
function getIPAddress (config) {
  let address  = new Address()
  const ifaces = os.networkInterfaces()
  for (const name in ifaces) {
    if (ifaces.hasOwnProperty(name)) {
      for (const record of ifaces[name]) {
        if (record.mac !== config.mac) {
          continue
        }
        switch (net.isIP(record.address)) {
          case 4:
            address.v4 = record.address
            break
          case 6:
            address.v6 = record.address
            break
        }
      }
    }
  }
  return address.reduce()
}

exports.getIPAddress = getIPAddress
exports.Address      = Address
