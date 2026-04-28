const router = require('express').Router();
const auth = require('../middleware/auth');
const { startSession, getSession, makeDecision, confirmSession } = require('../controllers/tryandbuy.controller');

router.use(auth);
router.post('/:orderId/start', startSession);
router.get('/:orderId', getSession);
router.post('/decision', makeDecision);
router.post('/:orderId/confirm', confirmSession);

module.exports = router;