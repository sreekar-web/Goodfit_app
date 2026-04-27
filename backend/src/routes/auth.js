const router = require('express').Router();
const { register, login, refresh, logout, getMe } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authMiddleware, getMe);

module.exports = router;