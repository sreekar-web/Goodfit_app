const prisma = require('../utils/prisma');

// START TRY & BUY SESSION
const startSession = async (req, res) => {
  try {
    const session = await prisma.tryAndBuySession.findFirst({
      where: { orderId: req.params.orderId },
    });

    if (!session) return res.status(404).json({ error: 'Try & Buy session not found' });
    if (session.isCompleted) return res.status(400).json({ error: 'Session already completed' });

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const updated = await prisma.tryAndBuySession.update({
      where: { id: session.id },
      data: { isActive: true, startedAt: new Date(), expiresAt },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SESSION STATUS
const getSession = async (req, res) => {
  try {
    const session = await prisma.tryAndBuySession.findFirst({
      where: { orderId: req.params.orderId },
      include: {
        order: {
          include: {
            items: { include: { product: { include: { images: true } } } },
          },
        },
      },
    });

    if (!session) return res.status(404).json({ error: 'Session not found' });

    if (session.isActive && session.expiresAt < new Date()) {
      await prisma.tryAndBuySession.update({
        where: { id: session.id },
        data: { isActive: false, isCompleted: true },
      });
      session.isActive = false;
      session.isCompleted = true;
    }

    const secondsLeft = session.expiresAt
      ? Math.max(0, Math.floor((new Date(session.expiresAt) - new Date()) / 1000))
      : 0;

    res.json({ ...session, secondsLeft });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// MAKE DECISION
const makeDecision = async (req, res) => {
  try {
    const { itemId, decision } = req.body;

    if (!['KEEP', 'RETURN'].includes(decision)) {
      return res.status(400).json({ error: 'Decision must be KEEP or RETURN' });
    }

    const item = await prisma.orderItem.update({
      where: { id: itemId },
      data: { decision },
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CONFIRM SESSION
const confirmSession = async (req, res) => {
  try {
    const session = await prisma.tryAndBuySession.findFirst({
      where: { orderId: req.params.orderId },
      include: {
        order: { include: { items: { include: { product: true } } } },
      },
    });

    if (!session) return res.status(404).json({ error: 'Session not found' });

    const keptItems = session.order.items.filter(i => i.decision === 'KEEP');
    const additionalAmount = keptItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await prisma.tryAndBuySession.update({
      where: { id: session.id },
      data: { isActive: false, isCompleted: true },
    });

    await prisma.order.update({
      where: { id: req.params.orderId },
      data: {
        status: 'COMPLETED',
        total: session.order.tryAndBuyFee + additionalAmount,
      },
    });

    await prisma.orderTimeline.create({
      data: { orderId: req.params.orderId, status: 'COMPLETED', note: 'Try & Buy completed' },
    });

    res.json({ additionalAmount, keptItems: keptItems.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { startSession, getSession, makeDecision, confirmSession };