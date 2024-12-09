const mongoose = require('mongoose');

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
  selectedTable: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  userName: { type: String, required: true },
  userAddress: { type: String },
  orderStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
});


const counterSchema = new mongoose.Schema({
  date: { type: String, unique: true },
  sequence: { type: Number, default: 1001 },
});


const Counter = mongoose.model('Counter', counterSchema, 'counters');


async function generateOrderId() {
  const todayDate = new Date().getDate().toString();


  const counter = await Counter.findOneAndUpdate(
    { date: todayDate },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );


  const orderId = `ORD${todayDate}-${counter.sequence}`;
  return orderId;
}


orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    this.orderId = await generateOrderId();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema, 'order');
