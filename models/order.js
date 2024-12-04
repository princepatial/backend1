const mongoose = require('mongoose');

// Global variable to store the in-memory counter
let dailyOrderCounter = 1001;
let lastResetDate = new Date().toISOString().split('T')[0]; 

// Function to generate the daily order ID
function generateDailyOrderId() {
  const today = new Date();
  const dateKey = today.toISOString().split('T')[0]; 
  const dayOfMonth = today.getDate();

  // Reset the counter if the date has changed
  if (dateKey !== lastResetDate) {
    dailyOrderCounter = 1001; 
    lastResetDate = dateKey;  
  }

  // Generate the order ID
  const orderId = `ORD${dayOfMonth}-${dailyOrderCounter}`;
  dailyOrderCounter++; 
  return orderId;
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

// Middleware to generate the daily order ID before saving
orderSchema.pre('save', function (next) {
  if (!this.orderId) {
    this.orderId = generateDailyOrderId();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema, 'order');
