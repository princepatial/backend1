const mongoose = require('mongoose');

// Create a separate schema to track daily order counter
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 1001 },
  last_reset_date: { type: String, required: true }
});

const Counter = mongoose.model('Counter', counterSchema, 'counters');

// Function to generate the daily order ID
async function generateDailyOrderId() {
  const today = new Date();
  const dateKey = today.toISOString().split('T')[0];
  const dayOfMonth = today.getDate();

  try {
    // Find or create the counter for today
    let counter = await Counter.findOneAndUpdate(
      { _id: dateKey },
      { 
        $setOnInsert: { last_reset_date: dateKey },
        $inc: { sequence_value: 1 }
      },
      { 
        upsert: true, 
        new: true, 
        setDefaultsOnInsert: true 
      }
    );

    // Generate the order ID
    const orderId = `ORD${dayOfMonth}-${counter.sequence_value}`;
    return orderId;
  } catch (error) {
    console.error('Error generating order ID:', error);
    throw new Error('Failed to generate order ID');
  }
}

// Define the Order schema
const orderSchema = new mongoose.Schema({
  orderId: { 
    type: String, 
    unique: true,
    required: true
  },
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
    try {
      this.orderId = await generateDailyOrderId();
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Order', orderSchema, 'order');
