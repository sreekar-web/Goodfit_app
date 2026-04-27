const router = require('express').Router();
const auth = require('../middleware/auth');
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart, validatePromo } = require('../controllers/cart.controller');

router.use(auth);
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:itemId', updateCartItem);
router.delete('/item/:itemId', removeFromCart);
router.delete('/clear', clearCart);
router.post('/promo', validatePromo);

module.exports = router;