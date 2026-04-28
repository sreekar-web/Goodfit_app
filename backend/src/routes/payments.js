const router = require('express').Router();
const auth = require('../middleware/auth');
const { createPaymentOrder, verifyPayment, getPaymentStatus, refundPayment } = require('../controllers/payment.controller');

router.use(auth);
router.post('/create', createPaymentOrder);
router.post('/verify', verifyPayment);
router.get('/status/:orderId', getPaymentStatus);
router.post('/refund', refundPayment);

module.exports = router;