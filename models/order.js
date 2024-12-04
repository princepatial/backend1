const mongoose = require('mongoose');

// Define a schema for tracking order numbers
const orderCounterSchema = new mongoose.Schema({
  lastOrderNumber: { type: Number, default: 1000 } 
});

const OrderCounter = mongoose.model('OrderCounter', orderCounterSchema, 'orderCounter');

// Function to generate the order ID
async function generateOrderId() {
  const today = new Date();
  const dayOfMonth = today.getDate(); 

  // Find and update the counter, incrementing the last order number
  const counter = await OrderCounter.findOneAndUpdate(
    {}, // Find the single counter document
    { $inc: { lastOrderNumber: 1 } },
    { new: true, upsert: true } 
  );

 
  return `ORD${dayOfMonth}-${counter.lastOrderNumber}`;
}

// Define the Order schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, 
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

// Middleware to generate the order ID before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    this.orderId = await generateOrderId();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema, 'order');
