const router = require('express').Router();
const auth = require('../middleware/auth');
const { getWishlist, addToWishlist, removeFromWishlist, checkWishlist } = require('../controllers/wishlist.controller');

router.use(auth);
router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.get('/check/:productId', checkWishlist);

module.exports = router;