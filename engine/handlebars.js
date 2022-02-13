const path = require('path')
const { engine } = require('express-handlebars')

module.exports = function(app) {
    app.engine('hbs', engine({
        layoutDir: path.join(__dirname, 'views/layouts'),
        defaultLayout: 'index',
        extname: 'hbs'
    }))
    app.set('views', './views/')
    app.set('view engine', 'hbs');
}