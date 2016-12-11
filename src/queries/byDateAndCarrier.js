const groupBy = require('lodash.groupby')

const $match = {
  userId: 'user4'
}

const $project = {
  // 'userId': 1,
  'shipment_infos.carrier': 1,
  'date': {
    $dateToString: {
      date: '$date',
      format: '%Y/%m/%d'
    }
  }
}
const $group = {
  _id: {
    // 'userId': '$userId',
    'carrier': '$shipment_infos.carrier',
    'date': '$date'
  },
  count: { $sum: 1 }
}
const $sort = {
  '_id.date': -1
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
    date: item._id.date,
    count: item.count
  }))
  const byDate = groupBy(flatList, item => item.date)
  const compact = Object.keys(byDate)
    .map(k => byDate[k])
    .map(
      x => x.reduce(
        (acc, item) => Object.assign(acc, {
          date: item.date,
          [item.carrier]: item.count
        }),
        {}
      )
    )
  return compact
}

module.exports = {
  steps,
  processData
}
