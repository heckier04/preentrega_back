



export const validateInputCarts = (req, res, next) => {
  const { cid, pid } = req.params;

  if (isNaN(cid) || isNaN(pid)) {
    return res.status(400).json({ error: 'El ID del carrito y del producto deben ser números válidos' });
  }

  next();
};


export const validateInputProducts = (req, res, next) => {
  const { title, code, price, stock, category } = req.body;
  
  if (!title || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  next();
};

