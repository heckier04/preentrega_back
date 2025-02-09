import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { validateInputProducts } from '../middlewares/validation.js';

const filePath = path.resolve('data', 'products.json');

// Función para leer el archivo de productos
const readFile = () => {
  try {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) || [];
  } catch (error) {
    console.error("❌ Error al leer el archivo products.json:", error);
    return [];
  }
};

// Función para escribir en el archivo de productos
const writeFile = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("❌ Error al escribir el archivo products.json:", error);
  }
};

const router = Router();

// Ruta para obtener todos los productos
router.get('/', (_req, res) => {
  const products = readFile();
  res.json(products);
});

// Ruta para obtener un producto por su ID
router.get('/:pid', (req, res) => {
  const products = readFile();
  const product = products.find(p => p.id === req.params.pid);

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json(product);
});

// Ruta para crear un nuevo producto
router.post('/', validateInputProducts, (req, res) => {
  const products = readFile();
  const { code } = req.body;

  if (products.some(p => p.code === code)) {
    return res.status(400).json({ error: "El código del producto ya existe" });
  }

  const newProduct = { id: uuidv4(), ...req.body };

  products.push(newProduct);
  writeFile(products);

  res.status(201).json(newProduct);
});

// Ruta para actualizar un producto existente
router.put('/:pid', validateInputProducts, (req, res) => {
  let products = readFile();
  const productIndex = products.findIndex(p => p.id === req.params.pid);

  if (productIndex === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  products[productIndex] = { ...products[productIndex], ...req.body, id: products[productIndex].id };
  writeFile(products);

  res.json({ message: "✅ Producto actualizado con éxito", product: products[productIndex] });
});

// Ruta para eliminar un producto
router.delete('/:pid', (req, res) => {
  let products = readFile();
  const productIndex = products.findIndex(p => p.id === req.params.pid);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  products.splice(productIndex, 1);
  writeFile(products);

  res.status(204).end();
});

export default router;
