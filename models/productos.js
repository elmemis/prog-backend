const fs = require('fs');
const path = require('path')

class Productos{
    constructor(fileName){
        this.archivo = path.join(__dirname, fileName)
    }

    async save(producto){
        try{
            const data = fs.readFileSync(this.archivo, 'utf-8')
            let productos = []
            let lastId = 0
            if (data){
                productos = JSON.parse(data)
                if (productos.length > 0) {
                    lastId = productos[productos.length - 1].id
                }
            }
            producto.id = lastId + 1
            productos.push(producto)
            await fs.writeFileSync(this.archivo, JSON.stringify(productos, null, 2), 'utf-8')
            return producto.id
        } 
        catch(err){
            if (err.code === 'ENOENT') {
                producto.id = 1
                await fs.writeFileSync(this.archivo, JSON.stringify([producto], null, 2), 'utf-8')
                return producto.id
            } else {
                throw new Error(`Error en lectura. \n${err}`)
            }
        }
    }

    async update(producto){
        try{
            await this.getById(producto.id)
            .then( async(vProducto) => {
                vProducto.title = producto.title || vProducto.title
                vProducto.price = producto.price || vProducto.price
                vProducto.thumbnail = producto.thumbnail || vProducto.thumbnail
                await this.getAll().then(async(allProducts) => {
                    const nProducts = []
                    for (const p of allProducts){
                        if (p.id === vProducto.id){
                            nProducts.push(vProducto)
                        } else {
                            nProducts.push(p)
                        }
                    }
                    await fs.writeFileSync(this.archivo, JSON.stringify(nProducts, null, 2), 'utf-8')
                })
            })
            return true
        }
        catch(err){
            throw new Error(`Error en lectura. \n${err}`)
        }
    }

    async getById(idNumber){
        let producto = {}
        try{
            const allProducts = await this.getAll().then( data => {
                for (const element of data){
                    if (element.id == idNumber){
                        producto = element
                    }
                };
            })
            return producto
        }
        catch(err){
            throw new Error(`Error en lectura. \n${err}`)
        }    
    }

    async getAll(){
        try{
            const data = await fs.readFileSync(this.archivo, 'utf-8')
            return JSON.parse(data)
        }
        catch(err){
            throw new Error(`Error en lectura. \n${err}`)
        }

    }

    async deleteById(idNumber){
        const productos = []
        let guardar = false
        try{
            const allProducts = await this.getAll().then( data => {
                for (const element of data){
                    if (element.id != idNumber){
                        productos.push(element)
                    } else {
                        guardar = true
                    }   
                }
            })
            if (guardar) {
                await fs.writeFileSync(this.archivo, JSON.stringify(productos, null, 2), 'utf-8')
            }
        }
        catch(err){
            throw new Error(`Error de escritura. \n${err}`)
        }
        return guardar
    }

    async deleteAll(){
        try{
            let productos = []
            await fs.writeFileSync(this.archivo, JSON.stringify(productos, null, 2), 'utf-8')
        }
        catch(err){
            throw new Error(`Error de escritura. \n${err}`)
        }
    }
}

module.exports = Productos