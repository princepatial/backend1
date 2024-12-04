const mongoose = require('mongoose');

// Function to generate unique order ID
const generateOrderId = async () => {
  // Find the last order to get the next sequence
  const lastOrder = await mongoose.models.Order
    .findOne()
    .sort({ _id: -1 })
    .select('orderId')
    .exec();

  // Get today's date
  const today = new Date();
  const datePrefix = `ORD${today.getMonth() + 1}${today.getDate()}`;

  // Determine the next sequence number
  let nextSequence = 1001;
  if (lastOrder && lastOrder.orderId) {
    const lastSequence = parseInt(lastOrder.orderId.split('-')[1]);
    nextSequence = lastSequence + 1;
  }

  return `${datePrefix}-${nextSequence}`;
};

const orderSchema = new mongoose.Schema({
  orderId: { 
    type: String, 
    default: generateOrderId,
    unique: true 
  },
  items: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    }
  ],
  tableNumber: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  userName: { type: String, required: true },
  userAddress: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema, 'order');
