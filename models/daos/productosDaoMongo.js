const mongoose = require('mongoose')

class Product {
    constructor(collection) {
        const productosSchema = new mongoose.Schema({
            title: { type: String, require: true, max: 100 },
            price: { type: Number, require: true },
            thumbnail: { type: String, require: true, max: 250 }
        })

        this.model = mongoose.model(collection, productosSchema)        
    }

    async insert(producto){
        const p = await this.model.create(producto)
        .then( result => {
            console.log(result)
            return result
        })
        .catch( err => {
            console.log(`Error al insertar un producto en mongo. Err ${err}`)
            throw err
        })
    }

    async 
}