import initApp from './app/index.js'
import { config } from './config/index.js'

const app = initApp()

app.listen(config.PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${config.PORT}`)
})
