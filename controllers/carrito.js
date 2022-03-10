const { Carritos } = require('../models/carritos')
const carritos = new Carritos("carritos.txt")

const { Productos } = require('../models/productos')
const productos = new Productos("productos.txt")

module.exports = {
    addItemBag: (req, res) => {
        (async() => {
            const carrito = await carritos.getById(req.params.id)
            const { products } = req.body
        
            carrito['products'] = [];
            for (const productId in products){
                let producto = await productos.getById(products[productId])
                if (producto){
                    carrito['products'].push(producto)
                }
            }
            
            if (carritos.update(req.params.id, carrito)){
                res.status(201).json({msg: `Productos ${products} agregados al carrito.`}).send() 
            } else {
                res.status(400).json({msg: `Productos ${products} no se pudieron agregar al carrito.`}).send() 
            }  
            
        })();

    },
    deleteItemBag: async(req, res) => {
        (async() => {
            const prodId = req.params.id_prod
            const carrito = await carritos.getById(req.params.id)
            if (carrito['products'] && carrito['products'].length > 0){
                carrito['products'] = carrito['products'].filter(function(value, index, arr){
                    return value.id != prodId
                })
                if (carritos.update(req.params.id, carrito)){
                    res.status(201).json({msg: `Producto ${prodId} eliminado del carrito.`}).send() 
                } else {
                    res.status(400).json({msg: `Producto ${prodId} no pudo eliminar el producto.`}).send() 
                }  
            }
        })();
    },
    getItemsBag: async(req, res) => {
        const carrito = await carritos.getById(req.params.id)
        if (carrito){
            if (carrito['products']){
                res.status(200).json(carrito['products']).send()
            } else {
                res.status(200).json({}).send()
            }
        } else {
            res.status(404).json({msg: `Carrito ${req.params.id} no encontrado.`}).send()
        }

    },
    createBag: async(req, res) => {
        await carritos.create()
        .then( result => {
            res.status(201).json({id: result}).send()
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(JSON.stringify(error)).send()
        })
    },
    deleteBag: async(req, res) => {
        if (await carritos.delete(req.params.id)){
            res.status(200).json({msg: `Carrito ${req.params.id} eliminado.`}).send()
        } else {
            res.status(404).json({msg: `Carrito ${req.params.id} no encontrado.`}).send()
        }            
    },
    getBags: async(req, res) => {
        await carritos.getAll()
        .then( result => {
            res.status(200).json(result).send()
        })
        .catch( error => {
            console.log(error)
            res.status(500).json(JSON.stringify(error)).send()
        })
    }

}