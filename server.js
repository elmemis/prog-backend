const express = require('express')
const path = require('path')

const PORT = process.env.port || 8080

//const Contenedor = require('./models/productos')
//const prod = new Contenedor("productos.txt")

const productosRouter = require('./routes/productos')

const { engine } = require('express-handlebars')

const app = express()

//app.use(express.json())
//app.use(express.urlencoded({ extended: true }))

app.engine('hbs', engine({
  layoutDir: path.join(__dirname, 'views/layouts'),
  defaultLayout: 'index',
  extname: 'hbs'
}))
app.set('view engine', 'hbs')

app.use('/static', express.static(path.join(__dirname, 'public')))


app.get('/', async(req, res) => {
  //const productos = await prod.getAll()
  //console.log(pr)
  //res.render("productos", { productos, name: 'Emiliano'})
  res.render('main')
})

app.use('/productos', productosRouter)

/*
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get('/productos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/productos.html'))
})
*/

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