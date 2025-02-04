import express from 'express'
import { ProductsRouter, CartsRouter } from '../routes/index.js'
import { logger } from '../middlewares/logger.js'
import { validateProduct } from '../middlewares/validation.js'

const initApp = () => {
  const app = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(logger)

  app.use('/api/products', validateProduct, ProductsRouter)
  app.use('/api/carts', CartsRouter)

  return app
}

export default initApp
