const prisma = require('../utils/prisma');

// GET CART
const getCart = async (req, res) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: { include: { images: true } } },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
        include: {
          items: {
            include: { product: { include: { images: true } } },
          },
        },
      });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const { productId, size, quantity = 1, tryAndBuy = false } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ error: 'productId and size are required' });
    }

    let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.user.id } });
    }

    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId_size: { cartId: cart.id, productId, size } },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, size, quantity, tryAndBuy },
      });
    }

    const updated = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: { include: { images: true } } },
        },
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE CART ITEM
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity < 1) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: { include: { images: true } } },
        },
      },
    });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REMOVE FROM CART
const removeFromCart = async (req, res) => {
  try {
    await prisma.cartItem.delete({ where: { id: req.params.itemId } });

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: { include: { images: true } } },
        },
      },
    });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CLEAR CART
const clearCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VALIDATE PROMO CODE
const validatePromo = async (req, res) => {
  try {
    const { code } = req.body;
    const promo = await prisma.promoCode.findUnique({ where: { code } });

    if (!promo || !promo.isActive) {
      return res.status(400).json({ error: 'Invalid or expired promo code' });
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Promo code has expired' });
    }

    res.json({ code: promo.code, discount: promo.discount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart, validatePromo };