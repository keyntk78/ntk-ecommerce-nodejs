const mongoose = require('mongoose')
const { db } = require('../configs/config.mongodb')

const connectString = `mongodb://${db.host}:${db.port}/${db.name}`

class Database {
  constructor() {
    this.connect()
  }

  connect(type = 'mongodb') {
    mongoose.set('debug', true)
    mongoose.set('debug', { color: true })
    mongoose
      .connect(connectString)
      .then((_) => {
        console.log('Connect db Success')
      })
      .catch((err) => console.log('Error connect db'))
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb
