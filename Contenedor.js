const fs = require('fs');
const path = require('path')

class Contenedor{
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

    async getById(idNumber){
        let producto = {}
        try{
            const allProducts = await this.getAll().then( data => {
                data.forEach(element => {
                    if (element.id == idNumber){
                        producto = element
                    }
                    
                });
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
                data.forEach(element => {
                    if (element.id != idNumber){
                        productos.push(element)
                    } else {
                        guardar = true
                    }   
                });
            })
            if (guardar) {
                await fs.writeFileSync(this.archivo, JSON.stringify(productos, null, 2), 'utf-8')
                //console.info(`Se ha eliminado el producto ID ${idNumber}.`)
            }
        }
        catch(err){
            throw new Error(`Error de escritura. \n${err}`)
        }
    }

    async deleteAll(){
        try{
            let productos = []
            await fs.writeFileSync(this.archivo, JSON.stringify(productos, null, 2), 'utf-8')
            //console.info(`Se han eliminado todos los productos.`)
        }
        catch(err){
            throw new Error(`Error de escritura. \n${err}`)
        }
    }
}

module.exports = Contenedor