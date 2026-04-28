const Razorpay = require('razorpay');
const crypto = require('crypto');
const prisma = require('../utils/prisma');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CREATE ORDER (initiates payment)
const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: req.user.id },
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100), // paise
      currency: 'INR',
      receipt: order.id,
      notes: { orderId: order.id, userId: req.user.id },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentId: razorpayOrder.id },
    });

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VERIFY PAYMENT
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update order payment status
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'paid', paymentId: razorpay_payment_id },
    });

    await prisma.orderTimeline.create({
      data: { orderId, status: 'PLACED', note: 'Payment confirmed' },
    });

    res.json({ success: true, paymentId: razorpay_payment_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET PAYMENT STATUS
const getPaymentStatus = async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.orderId, userId: req.user.id },
      select: { paymentStatus: true, paymentId: true, total: true },
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REFUND PAYMENT
const refundPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: req.user.id },
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ error: 'Order not paid' });
    }

    const refund = await razorpay.payments.refund(order.paymentId, {
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'refunded' },
    });

    res.json(refund);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createPaymentOrder, verifyPayment, getPaymentStatus, refundPayment };