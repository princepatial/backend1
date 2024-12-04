const mongoose = require('mongoose');

// Function to generate a short order ID
function generateShortOrderId() {
  const timestamp = Date.now().toString().slice(-4); 
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase(); 
  return ORD${timestamp}${randomPart}; 
}

const orderSchema = new mongoose.Schema({
  orderId: { type: String, default: generateShortOrderId, unique: true }, // Short Order ID
  items: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  tableNumber: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  userName: { type: String, required: true },
  userAddress: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema, 'order');
