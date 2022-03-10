const { optionsMySQL } = require('./options')
const conn = require('knex')(optionsMySQL)

conn.schema.createTable('productos', table => {
    table.increments('id')
    table.string('title')
    table.integer('price')
    table.string('thumbnail')
})
.then(() => console.log('table created.'))
.catch((err) => { console.log(err); throw err})
.finally(() => {
    conn.destroy();
});

console.log('creacion de base de datos')