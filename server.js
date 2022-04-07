

(async () => {

  require('dotenv').config()
  const express = require('express')
  const path = require('path')
  const http = require('http')
  const { Server } = require('socket.io')

  const PORT = process.env.LISTEN_PORT || 8081

  const cookieParser = require('cookie-parser')
  const session = require('express-session')

  const mongoose = require('mongoose')
  const MongoStore = require('connect-mongo')
  const { mongoConfig } = require('./config')
  const { HOSTNAME, SCHEMA, DATABASE, USER, PASSWORD, OPTIONS } = mongoConfig

  const { normalize, schema } = require('normalizr')

  const productosRouter = require('./routes/productos')
  const productosRouterApi = require('./routes/productos-faker')
  const hbsEngine = require('./engine/handlebars')

  const chat = require('./mensajeria/chat')

  

  const app = express()
  const server = http.createServer(app)
  const io = new Server(server)



  const autor = new schema.Entity("autores", {}, { idAttribute: 'email' })
  const mensaje = new schema.Entity("mensajes", {
    autor: autor
  });
  const datamsg = new schema.Entity("datamsg", {
    mensajes: [mensaje]
  });


  try{
    await mongoose.connect(`${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`)

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use(cookieParser("ads9asd90ads09asd"))
    app.use(session({
      secret: '456wefsdm2',
      resave: true,
      saveUninitialized: true,
      store: new MongoStore({
        mongoUrl: `${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`,
        ttl: 1 * 60,
        expires: 1000 * 1 * 60,
        autoRemove: true
      })
    }))

    hbsEngine(app)

    app.use('/static', express.static(path.join(__dirname, 'public')))
    app.set('socket.io', io)

    io.on('connection', chat)

    app.get('/', (req, res) => {
      res.render('main')
    })

    app.use('/productos', productosRouter)
    app.use('/api', productosRouterApi)

    const sv = server.listen(PORT, function(){
      console.log(`Servidor iniciando en port ${PORT}`)
    })

  }
  catch(err){
    console.log(`Error al conectar MongoDB: ${err}`)
  }
})()