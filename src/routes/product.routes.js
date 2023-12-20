import { Router } from 'express'
import productsController from '../controllers/productsController.js'

const productRouter = Router()

productRouter.post('/', productsController.validateProductData ,productsController.createProduct)
productRouter.get('/', productsController.getProducts)
productRouter.get('/:pid', productsController.getProductByID)
productRouter.put('/:pid', productsController.putProduct)
productRouter.delete('/', productsController.deleteProduct)

export default productRouter