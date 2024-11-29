const express = require('express');
const { checkout, getAllOrders, updateOrder, deleteOrder } = require('../Controller/ordercontoller');
const router = express.Router();

router.post('/checkout', checkout);


router.get('/', getAllOrders);


router.put('/:id', orderController.updateOrder);


router.delete('/:id', orderController.deleteOrder);


module.exports = router;
