const validateProductInput = (req, res, next) => {
    const { title, description, code, price, stock, category } = req.body;
  
    if (!title || !description || !code || !price || !stock || !category) {
      return res
        .status(400)
        .send({ error: "Todos los campos son obligatorios, excepto thumbnails." });
    }
  
    next();
  };
  
  export default validateProductInput;
  