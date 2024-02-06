const express = require('express');
const { getProducts, postProducts } = require('../controller/productController');
const router = express.Router();

router.get('/',getProducts)
router.post('/',postProducts)

module.exports = router;