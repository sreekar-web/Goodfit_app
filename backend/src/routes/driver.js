const router = require('express').Router()
const {
  sendOtp,
  verifyOtp,
  getProfile,
  toggleOnline,
  updateLocation,
  seedDriver,
} = require('../controllers/driver.auth.controller')
const {
  getCurrentOrder,
  getOrderHistory,
  acceptOrder,
  updateOrderStatus,
  confirmPickup,
  startTryAndBuy,
  completeOrder,
  getEarnings,
} = require('../controllers/driver.order.controller')
const driverAuth = require('../middleware/driverAuth')

// Public routes
router.post('/send-otp', sendOtp)
router.post('/verify-otp', verifyOtp)
router.post('/seed', seedDriver)

// Auth protected routes
router.get('/profile', driverAuth, getProfile)
router.post('/toggle-online', driverAuth, toggleOnline)
router.post('/location', driverAuth, updateLocation)
router.get('/earnings', driverAuth, getEarnings)

// Order routes
router.get('/orders/current', driverAuth, getCurrentOrder)
router.get('/orders/history', driverAuth, getOrderHistory)
router.post('/orders/:orderId/accept', driverAuth, acceptOrder)
router.post('/orders/:orderId/status', driverAuth, updateOrderStatus)
router.post('/orders/:orderId/pickup', driverAuth, confirmPickup)
router.post('/orders/:orderId/start-tryandbuy', driverAuth, startTryAndBuy)
router.post('/orders/:orderId/complete', driverAuth, completeOrder)

module.exports = router