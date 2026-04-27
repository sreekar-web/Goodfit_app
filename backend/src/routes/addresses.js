const router = require('express').Router();
const auth = require('../middleware/auth');
const { getAddresses, addAddress, updateAddress, deleteAddress } = require('../controllers/address.controller');

router.use(auth);
router.get('/', getAddresses);
router.post('/', addAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

module.exports = router;