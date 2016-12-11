const $project = {
  'date': {
    $dateToString: {
      date: '$date',
      format: '%Y/%m/%d'
    }
  }
}
const $group = {
  _id: {
    'date': '$date'
  },
  count: { $sum: 1 }
}
const $sort = {
  '_id.date': -1
}

const steps = {
  $project,
  $group,
  $sort
}

function processData (res) {
  const flatList = res.map(item => ({
    date: item._id.date,
    count: item.count
  }))
  return flatList
}

module.exports = {
  steps,
  processData
}
