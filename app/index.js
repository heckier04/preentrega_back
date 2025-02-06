// app/index.js
import express from 'express';
import { ProductsRouter, CartsRouter } from '../routes/index.js';
import { logger } from '../middlewares/logger.js';

const initApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logger);

  // Rutas principales
  app.use('/api/products', ProductsRouter);
  app.use('/api/cart', CartsRouter);

  // Ruta para ver si la app responde
  app.get('/', (_req, res) => {
    res.send('Servidor funcionando correctamente');
  });

  return app;
};

export default initApp;
