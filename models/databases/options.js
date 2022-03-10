const optionsSQLite = {
    client: 'sqlite3',
    connection: {
        filename: './models/databases/database.sqlite'
    },
    useNullAsDefault: true
}

const optionsMySQL = {
    client: 'mysql',
    connection: {
        host: '192.168.186.10',
        user: 'coderhouse',
        password: 'coderhouse',
        database: 'coderhouse'
    }
}

module.exports = {
    optionsSQLite,
    optionsMySQL
}