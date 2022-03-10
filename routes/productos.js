const { Router } = require('express')
const router = Router()

const { body, checkSchema, validationResult } = require('express-validator');
const { newProductSchema, updProductSchema } = require('./validators/productos')
const productosController = require('../controllers/productos')
const { checkResourceAuthorization } = require('../middlewares/authorization.js')

//Obtener todos los productos.
router.get('/', productosController.getProducts)
//Obtener producto por su ID.
router.get('/:id', productosController.getProduct)
//Almacenar nuevo producto.
router.post('/', checkResourceAuthorization, checkSchema(newProductSchema), (req, res) => {
  const errorsValidation = validationResult(req, { strictParams: ['body'] } )
  if (!errorsValidation.isEmpty()){
    return res.status(400).json({errors: errorsValidation.array()})
  }
  productosController.addProduct(req, res)
})
//Actualizar atributos de un producto.
router.put('/:id', checkResourceAuthorization, checkSchema(updProductSchema), async(req, res) => {
  const errorsValidation = validationResult(req, { strictParams: ['body'] } )
  if (!errorsValidation.isEmpty()){
    return res.status(400).json({errors: errorsValidation.array()})
  }
  productosController.updateProduct(req, res)

})
//Eliminar un producto.
router.delete('/:id', checkResourceAuthorization, productosController.deleteProduct)

module.exports = router