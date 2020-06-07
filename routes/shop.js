const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');
const isLoggedIn = require('../utility/isAuthenticated');
const { check, body } = require('express-validator');

// Product Gets
router.get('/', shopController.getIndex);
router.get('/add-product', isLoggedIn.isLoggedIn, shopController.getAddProduct);
router.get('/product-detail/:id', shopController.getProduct);
router.get('/products', isLoggedIn.isLoggedIn, shopController.getProductList);
router.get('/edit-product/:id', isLoggedIn.isLoggedIn, shopController.getEditProduct);

// Cart Gets
router.get('/add-to-cart', isLoggedIn.isLoggedIn, shopController.getCart);

//Cart Posts
router.post('/add-to-cart', isLoggedIn.isLoggedIn, shopController.postCart);
router.post('/delete-cart-item/:id', isLoggedIn.isLoggedIn, shopController.deleteCart);
router.post('/edit-product/:id',[
  body('title').isLength({min: 3, max: 200}).trim().withMessage('Oops title must be at least 3 characters long and no longer than 200'),
  body('imageUrl').isString().withMessage('OOps something went wrong with the image.'),
  body('description').isLength({min: 5, max: 100}).trim().withMessage('Oops description must be longer than 5 characters long and no longer than 100')
], isLoggedIn.isLoggedIn, shopController.postEditProduct);

//Product Posts
router.post('/add-product',
[
  body('title').isLength({min: 3, max: 20}).trim().withMessage('Oops title must be at least 3 characters long and no longer than 20'),
  body('description').isLength({min: 5, max: 100}).trim().withMessage('Oops description must be longer than 5 characters long and no longer than 100')
],
   isLoggedIn.isLoggedIn, shopController.postProduct
);

router.post('/delete/:id', isLoggedIn.isLoggedIn, shopController.deleteProduct);

router.get('/orders', isLoggedIn.isLoggedIn, shopController.getOrder);

router.post('/orders', isLoggedIn.isLoggedIn, shopController.postOrder);

router.get('/checkout', isLoggedIn.isLoggedIn, shopController.getCheckout);

router.get('/checkout/success', isLoggedIn.isLoggedIn, shopController.postOrder);

router.get('/checkout/cancel', isLoggedIn.isLoggedIn, shopController.getCheckout)

// router.get('/404', shopController.get404);

module.exports = router;