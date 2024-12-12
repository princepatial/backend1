const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./Config/db');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorhandling');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import your Order model
const Order = require('./models/order');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/orders', orderRoutes);
app.use(errorHandler);

// Socket.io Namespace
const ordersNamespace = io.of('/orders');

ordersNamespace.on('connection', (socket) => {
  console.log('Client connected to /orders namespace');

  socket.on('joinOrder', async (orderId) => {
    try {
      // Find order by custom orderId
      const order = await Order.findOne({ orderId: orderId });
  
      if (order) {
        // Join a room specific to this order
        socket.join(orderId);
        
        // Emit order details to the specific client
        socket.emit('orderDetails', order);
      } else {
        socket.emit('error', { message: 'Order not found' });
      }
    } catch (err) {
      console.error('Error in joinOrder:', err);
      socket.emit('error', { 
        message: 'Failed to fetch order details', 
        error: err.message 
      });
    }
  });
  // Handle order status updates
  socket.on('updateOrderStatus', async (data) => {
    const { orderId, newStatus } = data;

    try {
      // Find and update the order by orderId
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId: orderId },
        { orderStatus: newStatus },
        { new: true, runValidators: true }
      );

      if (updatedOrder) {
        // Broadcast to all clients in this order's room
        ordersNamespace.to(orderId).emit('orderStatusUpdated', updatedOrder);
        
        // Optional: Broadcast to all connected clients
        ordersNamespace.emit('globalOrderStatusUpdate', updatedOrder);
      } else {
        socket.emit('error', { message: 'Order not found for update' });
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      socket.emit('error', { 
        message: 'Failed to update order status', 
        error: err.message 
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected from /orders namespace');
  });
});

// Global error handling for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optional: Implement graceful shutdown
});

// Global error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Optional: Implement graceful shutdown
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server, io };