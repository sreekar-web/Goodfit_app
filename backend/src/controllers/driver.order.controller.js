const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get current assigned order for driver
const getCurrentOrder = async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        driverId: req.driverId,
        status: {
          in: ['PREPARING', 'OUT_FOR_DELIVERY']
        }
      },
      include: {
        user: { select: { name: true, phone: true } },
        address: true,
        items: {
          include: {
            product: {
              include: { images: true }
            }
          }
        },
        tryAndBuySession: true,
      }
    })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get all completed orders for driver
const getOrderHistory = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        driverId: req.driverId,
        status: { in: ['DELIVERED', 'COMPLETED'] }
      },
      include: {
        user: { select: { name: true } },
        address: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Accept order
const acceptOrder = async (req, res) => {
  const { orderId } = req.params
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        driverId: req.driverId,
        status: 'PREPARING',
      }
    })
    res.json({ message: 'Order accepted', order })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Update order status
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params
  const { status } = req.body
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })

    // Add to timeline
    await prisma.orderTimeline.create({
      data: { orderId, status }
    })

    res.json({ message: 'Status updated', order })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Confirm pickup from store (store OTP verified)
const confirmPickup = async (req, res) => {
  const { orderId } = req.params
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'OUT_FOR_DELIVERY' }
    })

    await prisma.orderTimeline.create({
      data: { orderId, status: 'OUT_FOR_DELIVERY', note: 'Driver picked up from store' }
    })

    res.json({ message: 'Pickup confirmed', order })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Start Try & Buy session (customer OTP verified)
const startTryAndBuy = async (req, res) => {
  const { orderId } = req.params
  try {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    await prisma.tryAndBuySession.update({
      where: { orderId },
      data: {
        startedAt: new Date(),
        expiresAt,
        isActive: true,
      }
    })

    // Get order to find userId
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { userId: true }
    })

    // Emit to customer so their app shows the timer too
    const io = req.app.get('io')
    io.to(`user:${order.userId}`).emit('tryAndBuyStarted', {
      orderId,
      expiresAt,
    })

    res.json({ message: 'Try & Buy session started', expiresAt })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Complete order
const completeOrder = async (req, res) => {
  const { orderId } = req.params
  try {
    // Update order status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'COMPLETED' }
    })

    // Update driver total orders
    await prisma.driver.update({
      where: { id: req.driverId },
      data: { totalOrders: { increment: 1 } }
    })

    await prisma.orderTimeline.create({
      data: { orderId, status: 'COMPLETED', note: 'Order completed by driver' }
    })

    res.json({ message: 'Order completed', order })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get driver earnings summary
const getEarnings = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - 7)
    weekStart.setHours(0, 0, 0, 0)

    const [todayOrders, weekOrders, allOrders] = await Promise.all([
      prisma.order.count({
        where: { driverId: req.driverId, status: 'COMPLETED', createdAt: { gte: today } }
      }),
      prisma.order.count({
        where: { driverId: req.driverId, status: 'COMPLETED', createdAt: { gte: weekStart } }
      }),
      prisma.order.count({
        where: { driverId: req.driverId, status: 'COMPLETED' }
      }),
    ])

    const driver = await prisma.driver.findUnique({
      where: { id: req.driverId },
      select: { rating: true, totalOrders: true }
    })

    res.json({
      today: { orders: todayOrders, earnings: todayOrders * 65 },
      week: { orders: weekOrders, earnings: weekOrders * 65 },
      total: { orders: allOrders },
      rating: driver.rating,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getCurrentOrder,
  getOrderHistory,
  acceptOrder,
  updateOrderStatus,
  confirmPickup,
  startTryAndBuy,
  completeOrder,
  getEarnings,
}