const dev = {
  appConfig: {
    port: process.env.DEV_APP_PORT || 3000
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_POST || 27017,
    name: process.env.DEV_DB_NAME || 'shopEcommerce'
  }
}

const pro = {
  appConfig: {
    port: process.env.PRO_APP_PORT || 3000
  },
  db: {
    host: process.env.PRO_DB_HOST || 'localhost',
    port: process.env.PRO_PRO_POST || 27017,
    name: process.env.PRO_DB_NAME || 'shopPro'
  }
}

const config = { dev, pro }
const env = process.env.NODE_ENV || 'dev'

module.exports = config[env]
