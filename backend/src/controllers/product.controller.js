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

// Auto-categorize product based on name and description
const autoCategorize = (name, description = '') => {
  const text = `${name} ${description}`.toLowerCase()

  if (text.match(/saree|salwar|lehenga|kurta|dupatta|ethnic|anarkali|churidar/)) return "Women's Ethnic"
  if (text.match(/shirt|polo|tshirt|t-shirt|men|trouser|jeans|blazer/)) return "Men's Topwear"
  if (text.match(/dress|top|crop|jumpsuit|skirt|blouse/)) return 'Tops & Dresses'
  if (text.match(/jacket|coat|hoodie|sweater|pullover|winter|wool/)) return 'Winter Wear'
  if (text.match(/bag|purse|clutch|tote|handbag/)) return 'Handbags'
  if (text.match(/serum|lipstick|foundation|mascara|beauty|skincare|makeup/)) return 'Beauty Needs'
  if (text.match(/earring|necklace|bracelet|ring|jewel|accessory/)) return 'Accessories'
  if (text.match(/shoe|sneaker|sandal|heel|boot|footwear/)) return 'Footwear'

  return 'Tops & Dresses' // default
}

// SEED SAMPLE DATA
const seedProducts = async (req, res) => {
  try {
    // Create all categories matching the frontend
    const categoryNames = [
      'Tops & Dresses',
      "Men's Topwear",
      "Women's Ethnic",
      'Winter Wear',
      'Handbags',
      'Beauty Needs',
      'Accessories',
      'Footwear',
    ]

    const createdCategories = {}
    for (const name of categoryNames) {
      const cat = await prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      })
      createdCategories[name] = cat.id
    }

    // Seed products for each category
    const products = [
      {
        name: 'Floral Wrap Dress',
        brand: 'Ethereal Threads',
        price: 2499, oldPrice: 3499, discount: '28% OFF',
        trending: true, stock: 20,
        categoryName: 'Tops & Dresses',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        image: '/images/p1.png',
      },
      {
        name: 'Crop Top Set',
        brand: 'Modern Muse',
        price: 1499, oldPrice: 1999, discount: '25% OFF',
        trending: true, stock: 15,
        categoryName: 'Tops & Dresses',
        sizes: ['XS', 'S', 'M', 'L'],
        image: '/images/p3.png',
      },
      {
        name: 'Classic White Shirt',
        brand: 'Raymond',
        price: 1299, oldPrice: 1799, discount: '27% OFF',
        trending: true, stock: 20,
        categoryName: "Men's Topwear",
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        image: '/images/p2.png',
      },
      {
        name: 'Slim Fit Polo',
        brand: 'Urban Edge',
        price: 999, oldPrice: 1499, discount: '33% OFF',
        trending: false, stock: 25,
        categoryName: "Men's Topwear",
        sizes: ['S', 'M', 'L', 'XL'],
        image: '/images/p4.png',
      },
      {
        name: 'Banarasi Silk Saree',
        brand: 'Ethnic Luxe',
        price: 8999, oldPrice: 12000, discount: '25% OFF',
        trending: true, stock: 5,
        categoryName: "Women's Ethnic",
        sizes: ['Free Size'],
        image: '/images/p1.png',
      },
      {
        name: 'Anarkali Suit',
        brand: 'Ethnic Luxe',
        price: 3499, oldPrice: 4999, discount: '30% OFF',
        trending: false, stock: 10,
        categoryName: "Women's Ethnic",
        sizes: ['XS', 'S', 'M', 'L'],
        image: '/images/p2.png',
      },
      {
        name: 'Wool Blend Overcoat',
        brand: 'H&M',
        price: 4999, oldPrice: 6999, discount: '28% OFF',
        trending: false, stock: 8,
        categoryName: 'Winter Wear',
        sizes: ['S', 'M', 'L', 'XL'],
        image: '/images/p3.png',
      },
      {
        name: 'Puffer Jacket',
        brand: 'Urban Edge',
        price: 3499, oldPrice: 4999, discount: '30% OFF',
        trending: true, stock: 12,
        categoryName: 'Winter Wear',
        sizes: ['S', 'M', 'L', 'XL'],
        image: '/images/p4.png',
      },
      {
        name: 'Leather Tote Bag',
        brand: 'Luxe Leather',
        price: 3499, oldPrice: 4999, discount: '30% OFF',
        trending: true, stock: 15,
        categoryName: 'Handbags',
        sizes: ['One Size'],
        image: '/images/p2.png',
      },
      {
        name: 'Designer Clutch',
        brand: 'Luxe Leather',
        price: 1999, oldPrice: 2999, discount: '33% OFF',
        trending: false, stock: 10,
        categoryName: 'Handbags',
        sizes: ['One Size'],
        image: '/images/p4.png',
      },
      {
        name: 'Vitamin C Face Serum',
        brand: 'Minimalist',
        price: 599, oldPrice: 799, discount: '25% OFF',
        trending: true, stock: 30,
        categoryName: 'Beauty Needs',
        sizes: ['30ml', '50ml'],
        image: '/images/p1.png',
      },
      {
        name: 'Matte Lipstick Set',
        brand: 'Kay Beauty',
        price: 799, oldPrice: 999, discount: '20% OFF',
        trending: true, stock: 25,
        categoryName: 'Beauty Needs',
        sizes: ['One Size'],
        image: '/images/p3.png',
      },
      {
        name: 'Gold Plated Earrings',
        brand: 'Ethnic Luxe',
        price: 899, oldPrice: 1299, discount: '30% OFF',
        trending: false, stock: 20,
        categoryName: 'Accessories',
        sizes: ['One Size'],
        image: '/images/p2.png',
      },
      {
        name: 'Statement Necklace',
        brand: 'Ethnic Luxe',
        price: 1299, oldPrice: 1799, discount: '27% OFF',
        trending: true, stock: 15,
        categoryName: 'Accessories',
        sizes: ['One Size'],
        image: '/images/p4.png',
      },
      {
        name: 'White Sneakers',
        brand: 'Nike',
        price: 3999, oldPrice: 4999, discount: '20% OFF',
        trending: true, stock: 10,
        categoryName: 'Footwear',
        sizes: ['6', '7', '8', '9', '10'],
        image: '/images/p1.png',
      },
      {
        name: 'Block Heel Sandals',
        brand: 'Steve Madden',
        price: 2499, oldPrice: 3499, discount: '28% OFF',
        trending: false, stock: 8,
        categoryName: 'Footwear',
        sizes: ['5', '6', '7', '8'],
        image: '/images/p3.png',
      },
    ]

    for (const p of products) {
      const { categoryName, sizes, image, ...productData } = p
      await prisma.product.create({
        data: {
          ...productData,
          categoryId: createdCategories[categoryName],
          images: { create: [{ url: image }] },
          sizes: { create: sizes.map(size => ({ size, stock: 5 })) },
        }
      })
    }

    // Keep promo codes
    await prisma.promoCode.upsert({
      where: { code: 'GOODFIT25' },
      update: {},
      create: { code: 'GOODFIT25', discount: 1000 },
    })
    await prisma.promoCode.upsert({
      where: { code: 'TRYBUY10' },
      update: {},
      create: { code: 'TRYBUY10', discount: 500 },
    })

    res.json({ message: 'Database seeded with all categories and products!' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getProducts, getProduct, getCategories, seedProducts, autoCategorize }