
const fs = require('fs');
const path = require('path')

class Messages{
    constructor(fileName){
        this.archivo = path.join(__dirname, fileName)
    }

    async save(message){
        await fs.promises.appendFile(this.archivo, JSON.stringify(message, null, 2) + ',')
        .then(() => { console.log('Message persisted.')})
        .catch(err => { console.log(`Can't persist message into ${this.archivo}. \nError: ${err}`)})
    }

    async get(){
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
