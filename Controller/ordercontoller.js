const Order = require('../models/order');

// Handle checkout
exports.checkout = async (req, res) => {
  const { items, tableNumber, mobileNumber } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }
  if (!tableNumber || !mobileNumber) {
    return res.status(400).json({ success: false, message: 'Table number and mobile number are required' });
  }

  try {
    // Save the order
    const order = await Order.create({ items, tableNumber, mobileNumber });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to place the order',
      error: error.message,
    });
  }
};

// GET: Retrieve all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};
