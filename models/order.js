const mongoose = require('mongoose');

// Define a schema for tracking order numbers
const orderCounterSchema = new mongoose.Schema({
  lastOrderNumber: { type: Number, default: 1000 },
  lastDate: { type: Date, default: null }
}, { timestamps: true });

const OrderCounter = mongoose.model('OrderCounter', orderCounterSchema, 'orderCounter');

// Function to generate the order ID
async function generateOrderId() {
  const today = new Date();
  const dayOfMonth = today.getDate();

  // First, try to find the last order
  let lastOrder = await Order.findOne({}).sort({ createdAt: -1 }).limit(1);
  
  let counter = await OrderCounter.findOne({});

  // If no counter exists, create one
  if (!counter) {
    counter = new OrderCounter({
      lastOrderNumber: 1000,
      lastDate: today
    });
    await counter.save();
  }

  // Determine the next order number
  let nextOrderNumber;
  if (lastOrder && lastOrder.orderId) {
    // Extract the number from the last order ID
    const lastOrderNumberMatch = lastOrder.orderId.match(/\d+$/);
    if (lastOrderNumberMatch) {
      nextOrderNumber = parseInt(lastOrderNumberMatch[0]) + 1;
    } else {
      nextOrderNumber = counter.lastOrderNumber + 1;
    }
  } else {
    nextOrderNumber = counter.lastOrderNumber + 1;
  }

  // Update the counter with the new order number and date
  counter = await OrderCounter.findOneAndUpdate(
    {}, 
    { 
      lastOrderNumber: nextOrderNumber,
      lastDate: today 
    },
    { new: true }
  );

  // Generate order ID with current day and next order number
  return `ORD${dayOfMonth}-${nextOrderNumber}`;
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

const Order = mongoose.model('Order', orderSchema, 'order');
module.exports = Order;
