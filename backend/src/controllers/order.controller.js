const prisma = require('../utils/prisma');

// PLACE ORDER
const placeOrder = async (req, res) => {
  try {
    const { addressId, tryAndBuy = false, promoCode } = req.body;

    if (!addressId) return res.status(400).json({ error: 'Address is required' });

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let discount = 0;
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({ where: { code: promoCode } });
      if (promo && promo.isActive) discount = promo.discount;
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tryAndBuyFee = tryAndBuy ? 99 : 0;
    const total = subtotal - discount + tryAndBuyFee;

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        addressId,
        total,
        discount,
        tryAndBuy,
        tryAndBuyFee,
        promoCode,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
            price: item.product.price,
            decision: 'UNDECIDED',
          })),
        },
        timeline: {
          create: [{ status: 'PLACED' }],
        },
      },
      include: {
        items: { include: { product: { include: { images: true } } } },
        timeline: true,
        address: true,
      },
    });

    if (tryAndBuy) {
      await prisma.tryAndBuySession.create({
        data: { orderId: order.id },
      });
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET MY ORDERS
const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: { include: { product: { include: { images: true } } } },
        address: true,
        timeline: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE ORDER
const getOrder = async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        items: { include: { product: { include: { images: true } } } },
        address: true,
        timeline: { orderBy: { createdAt: 'asc' } },
        tryAndBuySession: true,
      },
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE ORDER STATUS (admin/driver use)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    });

    await prisma.orderTimeline.create({
      data: { orderId: order.id, status, note },
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CANCEL ORDER
const cancelOrder = async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (!['PLACED', 'PREPARING'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled at this stage' });
    }

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });

    await prisma.orderTimeline.create({
      data: { orderId: order.id, status: 'CANCELLED', note: 'Cancelled by customer' },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { placeOrder, getMyOrders, getOrder, updateOrderStatus, cancelOrder };