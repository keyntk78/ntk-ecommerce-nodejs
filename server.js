const app = require('./src/app')
const { appConfig } = require('./src/configs/config.mongodb')

const PORT = appConfig.port || 3056

app.listen(PORT, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(`ECommerce start with ${PORT}`)
})
