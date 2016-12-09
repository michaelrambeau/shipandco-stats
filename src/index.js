require('dotenv').load()
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const Shipment = require('./ShipmentModel')

const url = process.env.MONGO_URL_STAGING
mongoose.connect(url)
console.log('Connect to', url)

const $project = {
  'userId': 1,
  'shipment_infos.carrier': 1
}
const $group = {
  _id: {
    'user': '$userId',
    'carrier': '$shipment_infos.carrier'
  },
  count: { $sum: 1 }
}
const $sort = {
  count: -1
}

const req = Shipment.aggregate()
req.append({ $project })
req.append({ $group })
req.append({ $sort })

const t0 = new Date()
console.log('Searching...')
req.exec().then((res, err) => {
  const duration = (new Date() - t0) / 1000
  if (err) return console.error(err)
  console.log('THE END', res)
  console.log('Duration', duration.toFixed(1), 'seconds')
  mongoose.disconnect()
})
