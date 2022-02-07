const express = require('express')
const path = require('path')

const PORT = process.env.port || 8080

//const Contenedor = require('./contenedor')
//const productos = new Contenedor("productos.txt")
const productosRouter = require('./routes/productos')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/api/productos', productosRouter)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get('/productos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/productos.html'))
})
/*
app.get('/productos', async(req, res, ) => {
  const listado = await productos.getAll()
  .then(result => {
    return result
  })
  .catch(error => {
    console.log(error)
    res.status(500)
  })
  res.send(JSON.stringify(listado)).status(200)
})

app.get('/productorandom', async(req, res, ) => {
  const listado = await productos.getAll()
  .then(result => {
    return result
  })
  .catch(error => {
    console.log(error)
    res.status(500)
  })
  const item = listado[Math.floor(Math.random()*listado.length)]
  res.send(JSON.stringify(item)).status(200)
})
*/

const server = app.listen(PORT, function(){
  console.log(`Servidor iniciando en port ${PORT}`)
})