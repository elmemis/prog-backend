const express = require('express')

const PORT = process.env.port || 3000

const Contenedor = require('./contenedor')
const productos = new Contenedor("productos.txt")

const app = express()

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

const server = app.listen(PORT, function(){
  console.log(`Servidor iniciando en port ${PORT}`)
})