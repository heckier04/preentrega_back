import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const filePath = path.resolve('data', 'carts.json');

// 📌 Función para leer el archivo de carritos con manejo de errores
const readFile = () => {
  try {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) || [];
  } catch (error) {
    console.error("❌ Error al leer el archivo carts.json:", error);
    return [];
  }
};

// 📌 Función para escribir en el archivo de carritos
const writeFile = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("❌ Error al escribir el archivo carts.json:", error);
  }
};

const router = Router();

// 📌 Crear un nuevo carrito con ID único
router.post('/', (_req, res) => {
  console.log("🛒 Creando un nuevo carrito...");
  const carts = readFile();
  const newCart = { id: uuidv4(), products: [] };

  carts.push(newCart);
  writeFile(carts);

  res.status(201).json(newCart);
});

// 📌 Obtener un carrito por ID
router.get('/:cid', (req, res) => {
  console.log(`🔍 Buscando carrito con ID: ${req.params.cid}`);
  const carts = readFile();
  const cart = carts.find(c => c.id === req.params.cid);

  if (!cart) {
    console.log("❌ Carrito no encontrado");
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  res.json(cart);
});

// 📌 Agregar un producto a un carrito existente
router.post('/:cid/product/:pid', (req, res) => {
  console.log(`🛍 Agregando producto ${req.params.pid} al carrito ${req.params.cid}...`);
  const carts = readFile();
  const cartIndex = carts.findIndex(c => c.id === req.params.cid);

  if (cartIndex === -1) {
    console.log("❌ Carrito no encontrado");
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  let cart = carts[cartIndex];
  let productIndex = cart.products.findIndex(p => p.product === req.params.pid);

  if (productIndex !== -1) {
    cart.products[productIndex].quantity += 1;
  } else {
    cart.products.push({ product: req.params.pid, quantity: 1 });
  }

  carts[cartIndex] = cart;
  writeFile(carts);

  res.status(201).json(cart);
});

export default router;
