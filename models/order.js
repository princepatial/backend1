const mongoose = require('mongoose');

const orderCounterSchema = new mongoose.Schema({
  date: { type: String, unique: true }, 
  count: { type: Number, default: 1001 }, 
});

const OrderCounter = mongoose.model('OrderCounter', orderCounterSchema, 'orderCounter');

// Function to generate the daily order ID
async function generateDailyOrderId() {
  const today = new Date();
  const dateKey = today.toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD'
  const dayOfMonth = today.getDate(); // Get the day of the month (e.g., 4 for December 4th)

  // Find the counter for today's date or create one
  const counter = await OrderCounter.findOneAndUpdate(
    { date: dateKey },
    { $inc: { count: 1001 } },
    { new: true, upsert: true } 
  );

  // Return the order ID with the 'ORD' prefix, day of month, and counter
  return `ORD${dayOfMonth}-${counter.count}`;
}

// Define the Order schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, // Short Order ID
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

// Middleware to generate the daily order ID before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    this.orderId = await generateDailyOrderId();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema, 'order');
