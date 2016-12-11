const groupBy = require('lodash.groupby')

// const $match = {
//   userId: 'user1'
// }
const $project = {
  'userId': 1,
  'shipment_infos.carrier': 1
}
const $group = {
  _id: {
    'userId': '$userId',
    'carrier': '$shipment_infos.carrier'
  },
  count: { $sum: 1 }
}
const $sort = {
  count: -1
}
const steps = {
  // $match,
  $project,
  $group,
  $sort
}

function processData (res) {
  const flatList = res.map(item => ({
    user: item._id.userId,
    carrier: item._id.carrier,
    count: item.count
  }))
  const byUser = groupBy(flatList, item => item.user)
  const compact = Object.keys(byUser)
    .map(k => byUser[k])
    .map(
      x => x.reduce(
        (acc, item) => Object.assign(acc, {
          user: item.user,
          [item.carrier]: item.count,
          total: acc.total + item.count
        }),
        { user: '', total: 0 }
      )
    )
  return compact
}

module.exports = {
  steps,
  processData
}
