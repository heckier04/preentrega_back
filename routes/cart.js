import { Router } from 'express'
import fs from 'fs'
import { config } from '../config/index.js'

const filePath = `${config.dirname}/data/cart.json`
const readFile = () => JSON.parse(fs.readFileSync(filePath, 'utf-8'))
const writeFile = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

const router = Router()

router.post('/', (req, res) => {
  const carts = readFile()
  const newCart = { id: Date.now().toString(), products: [] }
  carts.push(newCart)
  writeFile(carts)
  res.status(201).json(newCart)
})

router.get('/:cid', (req, res) => {
  const carts = readFile()
  const cart = carts.find(c => c.id == req.params.cid)
  cart ? res.json(cart) : res.status(404).json({ error: 'Carrito no encontrado' })
})

router.post('/:cid/product/:pid', (req, res) => {
  const carts = readFile()
  const cartIndex = carts.findIndex(c => c.id == req.params.cid)

  if (cartIndex === -1) return res.status(404).json({ error: 'Carrito no encontrado' })

  const { pid } = req.params
  const existingProduct = carts[cartIndex].products.find(p => p.product == pid)

  if (existingProduct) {
    existingProduct.quantity += 1
  } else {
    carts[cartIndex].products.push({ product: pid, quantity: 1 })
  }

  writeFile(carts)
  res.json(carts[cartIndex])
})

export default router
