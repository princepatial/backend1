const mongoose = require('mongoose');

// Create a separate schema for tracking order sequences globally
const orderSequenceSchema = new mongoose.Schema({
  _id: { type: String, default: 'global_sequence' },
  lastSequence: { type: Number, default: 1000 }
});

// Create a model for order sequence
const OrderSequence = mongoose.model('OrderSequence', orderSequenceSchema, 'order_sequences');

// Function to generate a unique, continuously incrementing order ID
async function generateOrderId() {
  // Get today's date in the format ORD{month}{day}
  const today = new Date();
  const datePrefix = `ORD${today.getMonth() + 1}${today.getDate()}`;

  // Find or create the global sequence document
  let sequenceDoc = await OrderSequence.findById('global_sequence');
  
  if (!sequenceDoc) {
    // If no sequence exists, create a new one starting from 1000
    sequenceDoc = new OrderSequence({ 
      _id: 'global_sequence', 
      lastSequence: 1000 
    });
  }

  // Increment the sequence and save
  const newSequence = sequenceDoc.lastSequence + 1;
  const orderId = `${datePrefix}-${newSequence}`;
  
  sequenceDoc.lastSequence = newSequence;
  await sequenceDoc.save();

  return orderId;
}

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
