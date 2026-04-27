const router = require('express').Router();
const { getProducts, getProduct, getCategories, seedProducts } = require('../controllers/product.controller');

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/seed', seedProducts);
router.get('/:id', getProduct);

module.exports = router;