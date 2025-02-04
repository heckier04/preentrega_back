export const validateProduct = (req, res, next) => {
  const { title, price, stock, category } = req.body

  if (!title || !price || !stock || !category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  if (typeof title !== 'string' || typeof category !== 'string') {
    return res.status(400).json({ error: 'Título y categoría deben ser strings' })
  }

  if (typeof price !== 'number' || typeof stock !== 'number') {
    return res.status(400).json({ error: 'Precio y stock deben ser números' })
  }

  next()
}
