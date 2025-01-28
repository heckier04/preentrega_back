import express, { json, urlencoded } from "express";
import routes from "../routes";
const { CartsRouter, ProductsRouter } = routes;
import { logger } from "../middlewares";

const initApp = () => {
  const app = express();

  app.use(logger);
  app.use(json());
  app.use(urlencoded({ extended: true }));


  app.use("/api/products", ProductsRouter);
  app.use("/api/carts", CartsRouter);

  return app;
};

export default initApp;
