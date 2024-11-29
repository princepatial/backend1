const express = require('express');
const { checkout, getAllOrders, updateOrder, deleteOrder } = require('../Controller/ordercontoller');
const router = express.Router();

router.post('/checkout', checkout);


router.get('/', getAllOrders);


router.put('/:id', ordercontroller.updateOrder);


router.delete('/:id', ordercontroller.deleteOrder);


module.exports = router;
