const initApp = require("./app").default;
const PORT = 8080;

const app = initApp();

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
