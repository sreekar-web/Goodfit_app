const prisma = require('../utils/prisma');

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const { category, search, trending, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (category) where.category = { name: { equals: category, mode: 'insensitive' } };
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { brand: { contains: search, mode: 'insensitive' } },
    ];
    if (trending === 'true') where.trending = true;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: { images: true, sizes: true, category: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({ products, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE PRODUCT
const getProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { images: true, sizes: true, category: true },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SEED SAMPLE DATA
const seedProducts = async (req, res) => {
  try {
    // Create categories
    const categories = await Promise.all([
      prisma.category.upsert({ where: { name: 'Dresses' }, update: {}, create: { name: 'Dresses' } }),
      prisma.category.upsert({ where: { name: 'Ethnic' }, update: {}, create: { name: 'Ethnic' } }),
      prisma.category.upsert({ where: { name: 'Outerwear' }, update: {}, create: { name: 'Outerwear' } }),
      prisma.category.upsert({ where: { name: 'Accessories' }, update: {}, create: { name: 'Accessories' } }),
    ]);

    // Create products
    const products = [
      {
        name: 'Ethereal Silk Dress',
        brand: 'Ethereal Threads',
        price: 4999,
        oldPrice: 7935,
        discount: '37% OFF',
        trending: true,
        stock: 50,
        categoryId: categories[0].id,
        images: { create: [{ url: '/images/p1.png' }] },
        sizes: { create: [
          { size: 'XS', stock: 10 }, { size: 'S', stock: 10 },
          { size: 'M', stock: 15 }, { size: 'L', stock: 10 },
          { size: 'XL', stock: 5 },
        ]},
      },
      {
        name: 'Premium Leather Jacket',
        brand: 'Urban Edge',
        price: 8999,
        trending: false,
        stock: 30,
        categoryId: categories[2].id,
        images: { create: [{ url: '/images/p2.png' }] },
        sizes: { create: [
          { size: 'S', stock: 5 }, { size: 'M', stock: 10 },
          { size: 'L', stock: 10 }, { size: 'XL', stock: 5 },
        ]},
      },
      {
        name: 'Contemporary Jumpsuit',
        brand: 'Modern Muse',
        price: 3999,
        oldPrice: 5969,
        discount: '33% OFF',
        trending: true,
        stock: 40,
        categoryId: categories[0].id,
        images: { create: [{ url: '/images/p3.png' }] },
        sizes: { create: [
          { size: 'XS', stock: 10 }, { size: 'S', stock: 10 },
          { size: 'M', stock: 10 }, { size: 'L', stock: 10 },
        ]},
      },
      {
        name: 'Designer Handbag',
        brand: 'Luxe Leather',
        price: 5499,
        trending: true,
        stock: 20,
        categoryId: categories[3].id,
        images: { create: [{ url: '/images/p2.png' }] },
        sizes: { create: [{ size: 'One Size', stock: 20 }] },
      },
    ];

    for (const p of products) {
      await prisma.product.create({ data: p });
    }

    // Create promo codes
    await prisma.promoCode.upsert({
      where: { code: 'GOODFIT25' },
      update: {},
      create: { code: 'GOODFIT25', discount: 1000 },
    });
    await prisma.promoCode.upsert({
      where: { code: 'TRYBUY10' },
      update: {},
      create: { code: 'TRYBUY10', discount: 500 },
    });

    res.json({ message: 'Sample data seeded successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProducts, getProduct, getCategories, seedProducts };