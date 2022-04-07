module.exports = {
    isAuth: (req, res, next) => {
        if (!req.session.user){
            return res.redirect('/?error=noAuthenticated')
        }
        next()
    },
    isLogged: (req, res, next) => {
        if (req.session.user){
            return res.redirect('/')
        }
        next()
    }
}