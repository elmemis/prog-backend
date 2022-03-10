const { Productos } = require('../models/productos')
const productos = new Productos("productos.txt")

module.exports = {
    addProduct: async(req, res) => {
        const { name, description, price, code, stock, thumbnail } = req.body
        const producto = {
            name: name,
            description: description,
            price: price,
            code: code,
            stock: stock*1,
            thumbnail: thumbnail,
            timestamp: Date.now()
        }
        await productos.save(producto)
        .then(result => {
            res.status(201).json({id: result}).send()
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(JSON.stringify(error)).send()
        })    
    },
    getProduct: async(req, res) => {
        await productos.getById(req.params.id)
        .then(result => {
            //if (Object.keys(result).length > 0){
            if (result){
                res.status(200).json(result).json()
            } else {
                res.status(404).json({msg: `Producto ${req.params.id} no encontrado.`}).send()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(JSON.stringify(error)).send()
        })
    },
    getProducts: async(req, res) => {
        await productos.getAll()
        .then( result => {
            res.status(200).json(result).send()
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(JSON.stringify(error)).send()
        })
    },
    deleteProduct: async(req, res) => {
        await productos.deleteById(req.params.id)
        .then( ret => {
            if (ret){
                res.status(200).json({msg: `Producto ${req.params.id} eliminado.`}).send()
            } else {
                res.status(404).json({msg: `Producto ${req.params.id} no encontrado.`}).send()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).send(JSON.stringify(error))
        })        
    },
    updateProduct: async(req, res) => {
        await productos.getById(req.params.id)
        .then( async (result) => {
            if (Object.keys(result).length > 0){
                req.body.id = req.params.id
                await productos.update(req.body)
                .then(
                    res.status(200).json({msg: `Producto ${req.params.id} actualizado.`}).send()
                )   
            } else {
                res.status(404).json({msg: `Producto ${req.params.id} no encontrado.`}).send()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).send(JSON.stringify(error))
        }) 
    }
}