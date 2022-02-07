const express = require('express')
const { Router } = express;

const router = Router()

const Contenedor = require('../contenedor')
const productos = new Contenedor("productos.txt")

router.get('/', async(req, res) => {
    await productos.getAll()
    .then(result => {
      res.status(200).send(JSON.stringify(result))
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
      //return result
    })
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
})

router.post('/', async(req, res) => {
    const { title, price, thumbnail } = req.body
    const producto = {
        title: title,
        price: price,
        thumbnail: thumbnail
    }
    await productos.save(producto)
    .then(result => {
      res.status(201).send(JSON.stringify( `{id: ${result}}` ))
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(JSON.stringify(error))
    })
    //res.redirect('/')
    
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