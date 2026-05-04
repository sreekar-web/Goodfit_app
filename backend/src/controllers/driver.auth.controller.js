const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

// Generate random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString()

// Send OTP
const sendOtp = async (req, res) => {
  const { phone } = req.body
  if (!phone) return res.status(400).json({ error: 'Phone number required' })

  try {
    // Check if driver exists
    const driver = await prisma.driver.findUnique({ where: { phone } })
    if (!driver) return res.status(404).json({ error: 'Driver not registered. Contact admin.' })
    if (!driver.isActive) return res.status(403).json({ error: 'Account not active. Contact admin.' })

    // Generate OTP
    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Save OTP
    await prisma.driverOtp.create({
      data: { phone, otp, expiresAt, driverId: driver.id }
    })

    // In production, send via Twilio/MSG91
    // For now, return OTP in response (dev only)
    console.log(`OTP for ${phone}: ${otp}`)

    res.json({ message: 'OTP sent successfully', otp }) // Remove otp in production

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Verify OTP and login
const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body
  if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' })

  try {
    // Find latest OTP for this phone
    const otpRecord = await prisma.driverOtp.findFirst({
      where: { phone, otp },
      orderBy: { createdAt: 'desc' }
    })

    if (!otpRecord) return res.status(400).json({ error: 'Invalid OTP' })
    if (new Date() > otpRecord.expiresAt) return res.status(400).json({ error: 'OTP expired' })

    // Get driver
    const driver = await prisma.driver.findUnique({ where: { phone } })
    if (!driver) return res.status(404).json({ error: 'Driver not found' })

    // Delete used OTP
    await prisma.driverOtp.delete({ where: { id: otpRecord.id } })

    // Generate JWT
    const token = jwt.sign(
      { driverId: driver.id, phone: driver.phone, role: 'driver' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.json({
      message: 'Login successful',
      token,
      driver: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        avatar: driver.avatar,
        rating: driver.rating,
        totalOrders: driver.totalOrders,
        isOnline: driver.isOnline,
      }
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get driver profile
const getProfile = async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: req.driverId },
      select: {
        id: true, name: true, phone: true,
        avatar: true, rating: true,
        totalOrders: true, isOnline: true,
        isActive: true, createdAt: true,
      }
    })
    res.json(driver)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Toggle online status
const toggleOnline = async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({ where: { id: req.driverId } })
    const updated = await prisma.driver.update({
      where: { id: req.driverId },
      data: { isOnline: !driver.isOnline }
    })
    res.json({ isOnline: updated.isOnline })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Update driver location
const updateLocation = async (req, res) => {
  const { latitude, longitude } = req.body
  try {
    await prisma.driver.update({
      where: { id: req.driverId },
      data: { latitude, longitude }
    })
    res.json({ message: 'Location updated' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Seed a test driver (dev only)
const seedDriver = async (req, res) => {
  try {
    const driver = await prisma.driver.upsert({
      where: { phone: '9999999999' },
      update: {},
      create: {
        name: 'Rahul Kumar',
        phone: '9999999999',
        isActive: true,
        isOnline: false,
        rating: 4.9,
      }
    })
    res.json({ message: 'Test driver created', driver })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { sendOtp, verifyOtp, getProfile, toggleOnline, updateLocation, seedDriver }