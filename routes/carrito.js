const { Router } = require('express');
const router = Router()

const bagsController = require('../controllers/carrito')

// Create bag
router.post('/', bagsController.createBag)
// Obtain Bags
router.get('/', bagsController.getBags)
// Delete bag
router.delete('/:id', bagsController.deleteBag)
// Obtain bag
router.get('/:id/productos', bagsController.getItemsBag)
// Add product to bag
router.post('/:id/productos', bagsController.addItemBag)
// Delete product in bag
router.delete('/:id/productos/:id_prod', bagsController.deleteItemBag)

module.exports = router