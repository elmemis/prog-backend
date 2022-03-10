const { optionsSQLite } = require('./options')
const conn = require('knex')(optionsSQLite)

conn.schema.createTable('messages', table => {
    table.string('text')
    table.string('email')
    table.datetime('date')
})
.then(() => console.log('table created.'))
.catch((err) => { console.log(err); throw err})
.finally(() => {
    conn.destroy();
});

console.log('creacion de estructura de datos')