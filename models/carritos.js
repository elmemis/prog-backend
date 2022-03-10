const fs = require('fs');
const path = require('path')

const { v4: uuidv4 } = require('uuid');

class Carritos{
    constructor(fileName){
        this.archivo = path.join(__dirname, fileName)
    }

    async getById(idCarrito){
        const carritos = await this.getAll()
        if (carritos.hasOwnProperty(idCarrito)){
            return carritos[idCarrito]
        } else {
            return null
        }
    }

    async getAll(){
        try{
            const data = await fs.readFileSync(this.archivo, 'utf-8')
            if (data.length == 0) {
                return {}
            } else {
                return JSON.parse(data)
            }
        }
        catch(err){
            throw new Error(`Error en lectura. \n${err}`)
        }
    }

    async update(id, carrito){
        try {
            const carritos = await this.getAll()
            carritos[id] = carrito
            //console.log(JSON.stringify(carritos, null, 2))
            await fs.writeFileSync(this.archivo, JSON.stringify(carritos, null, 2), 'utf-8')
            return true
        }
        catch(err){
            throw new Error(`Error de escritura. \n${err}`)
        }

    }

    async delete(idCarrito){
        try {
            const carritos = await this.getAll()
            if (carritos.hasOwnProperty(idCarrito)){
                delete carritos[idCarrito]
                await fs.writeFileSync(this.archivo, JSON.stringify(carritos, null, 2), 'utf-8')
                return true
            }
            return false
        }
        catch(err){
            throw new Error(`Error de escritura. \n${err}`)
        }

    }

    async create(){
        const uuid = uuidv4()
        const carrito = {
            timestamp: Date.now()
        }
        let carritos = {}
        try{
            const data = fs.readFileSync(this.archivo, 'utf-8')
            if (data.length > 0) {
                carritos = JSON.parse(data)
            }
            carritos[uuid] = carrito
            await fs.writeFileSync(this.archivo, JSON.stringify(carritos, null, 2), 'utf-8')
            return uuid
        } 
        catch(err){
            if (err.code === 'ENOENT') {
                carritos[uuid] = carrito
                await fs.writeFileSync(this.archivo, JSON.stringify(carritos, null, 2), 'utf-8')
                return uuid
            } else {
                throw new Error(`Error en lectura. \n${err}`)
            }
        }

    }
}

module.exports = { Carritos }