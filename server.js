const express = require('express')
const path = require('path')

const http = require('http')
const { Server } = require('socket.io')

const PORT = process.env.port || 8080

const productosRouter = require('./routes/productos')
const carritoRouter = require('./routes/carrito')

const hbsEngine = require('./engine/handlebars')

const Messages = require('./models/messages')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const messages = new Messages('messages.txt');
let msgList = [];
const users = {};

(async () => {
  msgList = await messages.get();
})();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

hbsEngine(app)

app.use('/static', express.static(path.join(__dirname, 'public')))
app.set('socket.io', io)

io.on('connection', (socket) => {
  socket.on('login', (email) => {
    users[socket.id] = email

    //for (const user of Object.entries(users)){
    //  socket.emit('usersOn', { id: user[0], email: user[1] })
    //}
    socket.emit('messages', msgList)
  })

  socket.on('disconnect', function() {
    console.log(`Disconnected: ${socket.id}`)
    console.log(`Disconnected user: ${users[socket.id]}`)
  })

  socket.on("message", (data) => {
    messages.save(data)
    msgList.push(data)
    socket.broadcast.emit('message', data)
  })

  //socket.on("products", (data) => {
  //  socket.broadcast.emit("products", '')
  //})
})

app.get('/', (req, res) => {
  res.render('main')
})

app.use('/api/productos', productosRouter)
app.use('/api/carrito', carritoRouter)

const sv = server.listen(PORT, function(){
  console.log(`Servidor iniciando en port ${PORT}`)
})
