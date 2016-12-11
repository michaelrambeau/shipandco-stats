const groupBy = require('lodash.groupby')

const $project = {
  'shipment_infos.carrier': 1,
  'shipping_address.country_code': 1
}
const $group = {
  _id: {
    carrier: '$shipment_infos.carrier',
    country: '$shipping_address.country_code'
  },
  count: { $sum: 1 }
}

const steps = {
  $project,
  $group
}

function processData (res) {
  const flatList = res.map(item => ({
    country: item._id.country,
    carrier: item._id.carrier,
    count: item.count
  }))
  const byCountry = groupBy(flatList, item => item.country)
  const compact = Object.keys(byCountry)
    .map(k => byCountry[k])
    .map(
      x => x.reduce(
        (acc, item) => Object.assign(acc, {
          country: item.country,
          [item.carrier]: item.count,
          total: acc.total + item.count
        }),
        { total: 0 }
      )
    )
  return compact
}

module.exports = {
  steps,
  processData
}
