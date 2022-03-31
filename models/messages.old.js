
const fs = require('fs');
const path = require('path')

const { optionsSQLite } = require('./databases/options')
const db = require('knex')(optionsSQLite)

class Messages{
    constructor(table){
        this.table = table
    }

    async save2(message){
        await fs.promises.appendFile(this.archivo, JSON.stringify(message, null, 2) + ',')
        .then(() => { console.log('Message persisted.')})
        .catch(err => { console.log(`Can't persist message into ${this.archivo}. \nError: ${err}`)})
    }

    async save(message){
        await db(this.table)
            .insert(message)
            .then( result => {
                console.log(`Mensaje insertado correctamente, ret ID: ${result}`)
                return result[0]
            })
            .catch(err => {
                console.log(`Error al inserta en la base. Err: ${err}`)
                throw err
            })

    }

    async get(){
        const messages = await db.from(this.table).select('*')
            .then((rows) => {
                return rows
            })
            .catch( err => { 
                console.log(`Error al obtener mensajes desde la base de datos. Err: ${err}`)
                throw err
            })
        return messages
    }

    async get2(){
        try{
            const msgs = await fs.readFileSync(this.archivo, 'utf-8')
            return JSON.parse(`[${msgs.slice(0, -1)}]`)
        }
        catch(err){
            console.log(`Can't read messages from file ${this.archivo}. \nError: ${err}`)
            throw new Error(`Error en lectura. \n${err}`)
        }
    }
}

module.exports = Messages