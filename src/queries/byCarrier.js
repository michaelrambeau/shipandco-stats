const $project = {
  'shipment_infos.carrier': 1
}
const $group = {
  _id: {
    'carrier': '$shipment_infos.carrier'
  },
  count: { $sum: 1 }
}

const steps = {
  $project,
  $group
}

function processData (res) {
  return res.map(item => ({
    carrier: item._id.carrier,
    count: item.count
  }))
}

module.exports = {
  steps,
  processData
}
