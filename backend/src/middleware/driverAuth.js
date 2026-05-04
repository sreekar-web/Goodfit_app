const jwt = require('jsonwebtoken')

const driverAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.role !== 'driver') {
      return res.status(403).json({ error: 'Not authorized as driver' })
    }
    req.driverId = decoded.driverId
    req.phone = decoded.phone
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

module.exports = driverAuth