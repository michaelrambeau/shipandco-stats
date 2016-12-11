require('dotenv').load()
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const Shipment = require('./ShipmentModel')
const writeJSON = require('./writeJSON')

function runQuery (steps, processData, filename, dbEnv) {
  const options = { server: { socketOptions: { socketTimeoutMS: 1000 * 120 }}}
  const url = process.env[`MONGO_URL_${dbEnv}`]
  mongoose.connect(url, options)
  console.log('Connect to', url)

  const req = Shipment.aggregate()
  Object.keys(steps).forEach(
    key => req.append({ [key]: steps[key] })
  )

  const t0 = new Date()
  console.log('Searching...')
  req.exec()
    .then(next)
    .finally(() => {
      mongoose.disconnect()
    })

  function next (res) {
    const duration = (new Date() - t0) / 1000
    console.log('Processing query result...', res.length)
    const json = processData(res)
    console.log(json)
    console.log('Request duration', duration.toFixed(1), 'seconds')
    writeJSON(json, filename)
  }
}

module.exports = runQuery
