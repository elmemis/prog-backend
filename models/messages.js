const mongoose = require('mongoose')
const { faker } = require('@faker-js/faker');

class Messages {
    constructor(){
        const schema = new mongoose.Schema({
            autor: { 
                email: String,
                nombre: String,
                apellido: String,
                edad: Number,
                alias: String,
                avatar: String
            },
            text: String,
            date: { type: Number, default: Date.now() }
        });
        this.model = mongoose.model("mensaje", schema)
    }

    async create(message) {
        const msg = await this.model.create(message)
        console.log(JSON.stringify(msg, null, 4))
        return msg
    }

    async getAll() {
        let msgs = []
        msgs = await this.model.find()
        return msgs.map((m) => {
            if (! m.autor.avatar){
                m.autor.avatar = faker.internet.avatar()
            }
            return {
                autor: m.autor,
                text: m.text,
                id: m._id,
                date: m.date
            }
        })
    }
}

module.exports = new Messages()