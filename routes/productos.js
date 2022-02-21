const express = require('express')
const { Router } = express;

const upload = require('../middlewares/file')

const router = Router()

const Contenedor = require('../models/productos')
const productos = new Contenedor("productos.txt")

router.get('/', async(req, res) => {
    await productos.getAll()
    .then(result => {
      res.render(
        "productos", 
        { 
          productos: result, 
          layout: false 
        }
      )
    })
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
})

router.get('/:id', async(req, res) => {
    await productos.getById(req.params.id)
    .then(result => {
      if (Object.keys(result).length > 0){
        res.status(200).send(JSON.stringify(result))
      } else {
        res.status(404).send(JSON.stringify(`{msg: 'Producto ${req.params.id} no encontrado.'}`))
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
})

router.post('/', upload.single('img'), async(req, res) => {
    const { title, price } = req.body
    const producto = {
        title: title,
        price: price,
        thumbnail: req.file.filename
    }
    await productos.save(producto)
    .then(result => {
      const io = req.app.get('socket.io');
      io.emit("products", '')
      //res.status(201).send(JSON.stringify( `{id: ${result}}` ))
      res.redirect('/')

    })
    .catch(error => {
      console.log(error)
      res.status(500).send(JSON.stringify(error))
    })    
})

router.put('/:id', async(req, res) => {
    await productos.getById(req.params.id)
    .then( async (result) => {
      if (Object.keys(result).length > 0){
        req.body.id = req.params.id
        await productos.update(req.body)
        .then(
          res.status(200).send(JSON.stringify(`{msg: 'Producto ${req.params.id} actualizado.'}`))
        )   
      } else {
        res.status(404).send(JSON.stringify(`{msg: 'Producto ${req.params.id} no encontrado.'}`))
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(JSON.stringify(error))
    }) 
})

router.delete('/:id', async(req, res) => {
    await productos.deleteById(req.params.id)
    .then( ret => {
      if (ret){
        const io = req.app.get('socket.io');
        io.emit("products", '')
        res.status(200).send(JSON.stringify(`{msg: 'Producto ${req.params.id} eliminado.'}`))
      } else {
        res.status(404).send(JSON.stringify(`{msg: 'Producto ${req.params.id} no encontrado.'}`))
      }
    }
    )
    .catch(error => {
        console.log(error)
        res.status(500).send(JSON.stringify(error))
    })
})

module.exports = router