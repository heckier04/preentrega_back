import { Router } from 'express'
import fs from 'fs'
import { config } from '../config/index.js'
import { validateProduct } from '../middlewares/index.js'

const filePath = `${config.dirname}/data/products.json`
const readFile = () => JSON.parse(fs.readFileSync(filePath, 'utf-8'))
const writeFile = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

const router = Router()

router.get('/', (req, res) => {
  const products = readFile()
  const { limit } = req.query
  res.json(limit ? products.slice(0, limit) : products)
})

router.get('/:pid', (req, res) => {
  const products = readFile()
  const product = products.find(p => p.id == req.params.pid)
  product ? res.json(product) : res.status(404).json({ error: 'Producto no encontrado' })
})

router.post('/', validateProduct, (req, res) => {
  const products = readFile()
  const newProduct = { id: Date.now().toString(), status: true, ...req.body }
  products.push(newProduct)
  writeFile(products)
  res.status(201).json(newProduct)
})

router.put('/:pid', validateProduct, (req, res) => {
  let products = readFile()
  const index = products.findIndex(p => p.id == req.params.pid)

  if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' })

  products[index] = { ...products[index], ...req.body, id: products[index].id }
  writeFile(products)

  res.json(products[index])
})

router.delete('/:pid', (req, res) => {
  let products = readFile()
  const newProducts = products.filter(p => p.id != req.params.pid)

  if (products.length === newProducts.length) return res.status(404).json({ error: 'Producto no encontrado' })

  writeFile(newProducts)
  res.json({ message: 'Producto eliminado' })
})

export default router
