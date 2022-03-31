const express = require('express')
const path = require('path')

const http = require('http')
const { Server } = require('socket.io')

const mongoose = require('mongoose')
const { HOSTNAME, SCHEMA, DATABASE, USER, PASSWORD, OPTIONS } = require("./config/mongo")

const { normalize, schema } = require("normalizr")

const PORT = process.env.port || 8080

const productosRouter = require('./routes/productos')
const productosRouterApi = require('./routes/productos-faker')
const hbsEngine = require('./engine/handlebars')

const Messages = require('./models/messages')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const messages = new Messages();
let msgList = {};
const users = {};

const autor = new schema.Entity("autores", {}, { idAttribute: 'email' })
const mensaje = new schema.Entity("mensajes", {
  autor: autor
});
const datamsg = new schema.Entity("datamsg", {
  mensajes: [mensaje]
});

(async () => {
  msgListFromDB = await messages.getAll()
  //msgList = { id: 'mensajes', mensajes: [normalize(msgListFromDB, mensajes)] }
  msgList = normalize({
    id: 'mensajes', 
    mensajes: msgListFromDB 
  }, datamsg)
  //console.log(JSON.stringify(msgList, null, 2))
  console.log(msgList)
})()


mongoose.connect(`${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`).then( () => {

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
      messages.create(data)
      //msgList.push(data)
      socket.broadcast.emit('message', data)
    })

    socket.on("products", (data) => {
      socket.broadcast.emit("products", '')
    })
  })

  app.get('/', (req, res) => {
    res.render('main')
  })

  app.use('/productos', productosRouter)
  app.use('/api', productosRouterApi)

  const sv = server.listen(PORT, function(){
    console.log(`Servidor iniciando en port ${PORT}`)
  })


}).catch((err) => console.log(`Error al conectar MongoDB: ${err}`))