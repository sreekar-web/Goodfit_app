const prisma = require('../utils/prisma');

const getAddresses = async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({ where: { userId: req.user.id } });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addAddress = async (req, res) => {
  try {
    const { label, line1, line2, city, state, pincode, isDefault } = req.body;

    if (!line1 || !city || !state || !pincode) {
      return res.status(400).json({ error: 'line1, city, state and pincode are required' });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: { userId: req.user.id, label, line1, line2, city, state, pincode, isDefault },
    });

    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const address = await prisma.address.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: req.body,
    });
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    await prisma.address.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };