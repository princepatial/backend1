const express = require('express');
const { checkout, getAllOrders } = require('../Controller/ordercontoller');
const router = express.Router();

router.post('/checkout', checkout);


router.get('/', getAllOrders);


module.exports = router;
