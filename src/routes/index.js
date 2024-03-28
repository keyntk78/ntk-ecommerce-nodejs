const express = require('express')
const { apiKey, permission } = require('../middlewares/checkAuth')

const router = express.Router()

//check apikey
router.use(apiKey)
//check permissions
router.use(permission('0000'))

router.use('/v1/api/product', require('./product'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api', require('./access'))

module.exports = router
