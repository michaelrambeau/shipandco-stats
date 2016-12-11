const runQuery = require('./helpers/runQuery')
const argv = require('minimist')(process.argv.slice(2))
const params = argv._
const query = params[0]
const dbParam = argv.db
const dbEnv = dbParam ? dbParam.toUpperCase() : 'SANDBOX'
if (!query) throw new Error('Specify the query to run!')

console.log('Query', query)
const options = require(`./queries/${query}`)
const { steps, processData } = options
const filename = `${query}.json`

runQuery(steps, processData, filename, dbEnv)
