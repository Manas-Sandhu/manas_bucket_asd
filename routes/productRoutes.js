const express = require('express')
const handlers = require('../controllers/productController')
const { checkCache, clearCache } = require('../middleware/cache')

const routes = express.Router()

routes.get('/', checkCache, handlers.getAllProducts)
routes.get('/:id', checkCache, handlers.getProductById)

routes.post('/', clearCache, handlers.addProduct)
routes.put('/:id', clearCache, handlers.updateProduct)
routes.patch('/:id', clearCache, handlers.patchProduct)
routes.delete('/:id', clearCache, handlers.deleteProduct)

module.exports = routes