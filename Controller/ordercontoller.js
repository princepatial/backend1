const Order = require('../models/order');

// Handle checkout
exports.checkout = async (req, res) => {
  const { items, selectedTable, mobileNumber, userName, userAddress } = req.body;

  // Validate input
  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }
  if (!selectedTable || !mobileNumber || !userName) {
    return res.status(400).json({ success: false, message: 'Required fields are missing' });
  }

  try {
    // Save the order
    const order = await Order.create({
      items,
      selectedTable,
      mobileNumber,
      userName,
      userAddress,
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
       orderId: order.orderId,
      order,
    });
  } catch (error) {
    console.error('Checkout error:', error);
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
  const { items, selectedTable, mobileNumber, userName, userAddress } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { items, selectedTable, mobileNumber, userName, userAddress },
      { new: true, runValidators: true } 
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
