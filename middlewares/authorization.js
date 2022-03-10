

const checkResourceAuthorization = (req, res, next) => {
    if (!req.body.isAdmin){
        res.status(401).json({ error: -1, descripcion: `${req.method} ${req.originalUrl} no autorizada.`}).send()
    } else {
        next()
    }
}
module.exports = { checkResourceAuthorization }