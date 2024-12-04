const mongoose = require('mongoose');

// Create a separate schema for tracking order sequences globally
const orderSequenceSchema = new mongoose.Schema({
  _id: { type: String, default: 'global_sequence' },
  lastSequence: { type: Number, default: 1000 }
});

// Create a model for order sequence
const OrderSequence = mongoose.model('OrderSequence', orderSequenceSchema, 'order_sequences');

// Separate function to get the next order ID
async function getNextOrderId() {
  // Get today's date in the format ORD{month}{day}
  const today = new Date();
  const datePrefix = `ORD${today.getMonth() + 1}${today.getDate()}`;

  // Find or create the global sequence document
  let sequenceDoc = await OrderSequence.findOneAndUpdate(
    { _id: 'global_sequence' },
    { $inc: { lastSequence: 1 } },
    { 
      new: true,  // Return the updated document
      upsert: true,  // Create the document if it doesn't exist
      setDefaultsOnInsert: true 
    }
  );

  // Generate the order ID
  const newSequence = sequenceDoc.lastSequence;
  return `${datePrefix}-${newSequence}`;
}

const orderSchema = new mongoose.Schema({
  orderId: { 
    type: String, 
    required: true,  // Make it required
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

// Middleware to generate orderId before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    try {
      this.orderId = await getNextOrderId();
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Order', orderSchema, 'order');
