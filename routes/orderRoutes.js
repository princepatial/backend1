const express = require('express');
const { 
  checkout, 
  getAllOrders, 
  updateOrder, 
  deleteOrder,
  updateOrderStatus
} = require('../Controller/ordercontoller');
const router = express.Router();

// Existing routes
router.post('/checkout', checkout);

router.get('/', getAllOrders);

router.put('/:id', updateOrder);

router.delete('/:id', deleteOrder);

router.put('/:id/status', updateOrderStatus);

module.exports = router;