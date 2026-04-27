const router = require('express').Router();
const auth = require('../middleware/auth');
const { placeOrder, getMyOrders, getOrder, updateOrderStatus, cancelOrder } = require('../controllers/order.controller');

router.use(auth);
router.post('/', placeOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/cancel', cancelOrder);

module.exports = router;