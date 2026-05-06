const prisma = require('../utils/prisma');

// GET WISHLIST
const getWishlist = async (req, res) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: { product: { include: { images: true, category: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD TO WISHLIST
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId is required' });

    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });

    if (existing) return res.status(400).json({ error: 'Already in wishlist' });

    const item = await prisma.wishlist.create({
      data: { userId: req.user.id, productId },
      include: { product: { include: { images: true } } },
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REMOVE FROM WISHLIST
const removeFromWishlist = async (req, res) => {
  try {
    await prisma.wishlist.deleteMany({
      where: { userId: req.user.id, productId: req.params.productId },
    });
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CHECK IF IN WISHLIST
const checkWishlist = async (req, res) => {
  try {
    const item = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId: req.user.id, productId: req.params.productId } },
    });
    res.json({ inWishlist: !!item, inWishlisted: !!item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist, checkWishlist };