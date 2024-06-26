const express = require('express')
const productController = require('../../controllers/product.controller')
const { asyncHander } = require('../../helpers/asyncHander')
const { verifyAccessToken2 } = require('../../middlewares/jwt')
const router = express.Router()

router.get('/search/:keySearch', asyncHander(productController.getListSearch))
router.get('', asyncHander(productController.getAllProducts))
router.get('/:product_id', asyncHander(productController.getProduct))

//verifyAccessToken
router.use(verifyAccessToken2)
router.post('', asyncHander(productController.createProduct))
router.patch('/:product_id', asyncHander(productController.updateProduct))

router.post('/publish/:id', asyncHander(productController.publishProductByShop))
router.post(
  '/unpublish/:id',
  asyncHander(productController.unPublishProductByShop)
)
//Query
router.get('/drafts/all', asyncHander(productController.getAllDraftsForShop))
router.get(
  '/published/all',
  asyncHander(productController.getAllPublishForShop)
)

module.exports = router
