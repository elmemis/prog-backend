const express = require('express')
const path = require('path')

const PORT = process.env.port || 8080

const productosRouter = require('./routes/productos')
const pugEngine = require('./engine/pug')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

pugEngine(app)

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render('main')
})

app.use('/productos', productosRouter)

const server = app.listen(PORT, function(){
  console.log(`Servidor iniciando en port ${PORT}`)
})