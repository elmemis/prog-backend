const path = require('path')

const { productosDao } = require('./databases/productosDaoMongo')

class Productos{
    constructor(table){
        this.table = table
    }

    async save(producto){
        const id = await db(this.table)
            .insert(producto)
            .then( result => {
                console.log(`Producto insertado correctamente, ret ID: ${result[0]}`)
                return result[0]
            })
            .catch(err => {
                console.log(`Error al inserta en la base. Err: ${err}`)
                throw err
            })

        return id
    }

    async update(producto){
        const ret = await db(this.table)
            .where('id', producto.id)
            .update(producto)
            .then( result => {
                return result
            })
            .catch(err => {
                console.log(`Error al inserta en la base. Err: ${err}`)
                throw err
            })
        return ret
    }

    async getById(idNumber){
        const product = await db.from(this.table).select('*').where('id', idNumber).first()
            .then((row) => {
                console.log(row)
                return row
            })
            .catch( err => { 
                console.log(`Error al obtener productos desde la base de datos. Err: ${err}`)
                throw err
            })
        return product
    }

    async getAll(){
        const products = await db.from(this.table).select('*')
            .then((rows) => {
                return rows
            })
            .catch( err => { 
                console.log(`Error al obtener productos desde la base de datos. Err: ${err}`)
                throw err
            })
        return products
    }

    async deleteById(idNumber){
        const ret = await db.from(this.table).where('id', idNumber).del()
            .then(() => {
                console.log(`Producto ${idNumber} eliminado.`)
                return true
            })
            .catch( err => { 
                console.log(`Error al eliminar producto id ${idNumber} en la base de datos. Err: ${err}`)
                throw err
            })
        return ret
    }

    async deleteAll(){
        const ret = await db.from(this.table).del()
            .then(() => {
                console.log('Productos eliminados.')
                return true
            })
            .catch( err => { 
                console.log(`Error al eliminar productos en la base de datos. Err: ${err}`)
                throw err
            })
        return ret 
    }
}

module.exports = Productos