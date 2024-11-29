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

// PUT: Update an order by ID
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { items, tableNumber, mobileNumber, name, address } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { items, tableNumber, mobileNumber, name, address },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update the order',
      error: error.message,
    });
  }
};

// DELETE: Delete an order by ID
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
      deletedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete the order',
      error: error.message,
    });
  }
};
