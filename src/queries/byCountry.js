const $project = {
  'shipping_address.country_code': 1
}
const $group = {
  _id: {
    'country': '$shipping_address.country_code'
  },
  count: { $sum: 1 }
}

const steps = {
  $project,
  $group
}

function processData (res) {
  return res.map(item => ({
    country: item._id.country,
    count: item.count
  }))
}

module.exports = {
  steps,
  processData
}
