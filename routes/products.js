import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { validateInputProducts } from '../middlewares/validation.js';  // Asegúrate de tener el middleware de validación

const filePath = path.resolve('data', 'products.json');  // Ruta al archivo products.json

// 📌 Función para leer el archivo de productos con manejo de errores
const readFile = () => {
  try {
    if (!fs.existsSync(filePath)) return [];  // Si el archivo no existe, retorna un array vacío
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) || [];  // Si el archivo existe, parsea y retorna los datos
  } catch (error) {
    console.error("❌ Error al leer el archivo products.json:", error);
    return [];  // Retorna un array vacío en caso de error
  }
};

// 📌 Función para escribir en el archivo de productos
const writeFile = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));  // Escribe los datos en el archivo
  } catch (error) {
    console.error("❌ Error al escribir el archivo products.json:", error);
  }
};

const router = Router();

// 📌 Obtener todos los productos
router.get('/', (_req, res) => {
  const products = readFile();  // Lee los productos
  res.json(products);  // Devuelve todos los productos en formato JSON
});

// 📌 Obtener un producto por ID
router.get('/:pid', (req, res) => {
  const products = readFile();  // Lee los productos
  const product = products.find(p => p.id === req.params.pid);  // Busca el producto por su ID

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });  // Si no se encuentra el producto, devuelve 404
  }

  res.json(product);  // Si se encuentra, devuelve el producto en formato JSON
});

// 📌 Crear un nuevo producto (con validación de código único y ID único generado con UUID)
router.post('/', validateInputProducts, (req, res) => {
  const products = readFile();  // Lee los productos
  const { code } = req.body;  // Extrae el código del producto del cuerpo de la solicitud

  // Verifica si el código del producto ya existe
  if (products.some(p => p.code === code)) {
    return res.status(400).json({ error: "El código del producto ya existe" });  // Si el código ya existe, devuelve error
  }

  // Genera un ID único para el nuevo producto utilizando uuid
  const newProduct = { id: uuidv4(), ...req.body };  // Crea un nuevo producto con los datos recibidos

  products.push(newProduct);  // Agrega el nuevo producto al array de productos
  writeFile(products);  // Escribe los productos actualizados en el archivo

  res.status(201).json(newProduct);  // Devuelve el nuevo producto con el código 201 (Creado)
});

// 📌 Actualizar un producto por ID (sin modificar el ID)
router.put('/:pid', validateInputProducts, (req, res) => {
  let products = readFile();  // Lee los productos
  const productIndex = products.findIndex(p => p.id === req.params.pid);  // Busca el índice del producto a actualizar

  // Si no se encuentra el producto, devuelve error 404
  if (productIndex === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  // Actualiza el producto con los nuevos datos, manteniendo el ID original
  products[productIndex] = { ...products[productIndex], ...req.body, id: products[productIndex].id };  
  writeFile(products);  // Escribe los productos actualizados en el archivo

  res.json({ message: "✅ Producto actualizado con éxito", product: products[productIndex] });  // Devuelve el producto actualizado
});

// 📌 Eliminar un producto por ID
router.delete('/:pid', (req, res) => {
  let products = readFile();  // Lee los productos
  const productIndex = products.findIndex(p => p.id === req.params.pid);  // Busca el índice del producto a eliminar

  // Si no se encuentra el producto, devuelve error 404
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  products.splice(productIndex, 1);  // Elimina el producto del array
  writeFile(products);  // Escribe los productos actualizados en el archivo

  res.status(204).end();  // Devuelve respuesta 204 (Sin contenido), indicando que la eliminación fue exitosa
});

export default router;
