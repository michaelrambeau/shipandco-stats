const fs = require('fs')
const path = require('path')

function writeJSON (json, filename) {
  const filepath = path.join(process.cwd(), 'build', filename)
  const writer = fs.createWriteStream(filepath)
  writer.write(JSON.stringify(json))
  writer.end()
  console.log('File created', filepath)
}

module.exports = writeJSON
