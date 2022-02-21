const express = require('express')
const path = require('path')

const http = require('http')
const { Server } = require('socket.io')

const PORT = process.env.port || 8080

const productosRouter = require('./routes/productos')
const pugEngine = require('./engine/pug')
const ejsEngine = require('./engine/ejs')
const hbsEngine = require('./engine/handlebars')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

hbsEngine(app)

app.use('/static', express.static(path.join(__dirname, 'public')))
app.set('socket.io', io)

io.on('connection', (socket) => {
  console.log(`nuevo socket iniciado: ${socket.id}`)


  socket.on("message", (data) => {
    console.log(data)
  })

  socket.on("products", (data) => {
    console.log(data)
    socket.broadcast.emit("products", '')
  })
})

app.get('/', (req, res) => {
  res.render('main')
})

app.use('/productos', productosRouter)

const sv = server.listen(PORT, function(){
  console.log(`Servidor iniciando en port ${PORT}`)
})