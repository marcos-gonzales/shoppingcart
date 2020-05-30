const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { check, body } = require('express-validator');
const shopController = require('../controllers/shop');


router.get('/signup', authController.getSignup);
router.get('/login', authController.getLogin)

router.post('/signup',
[
  body('name').isLength({ min: 3}).withMessage('oops name must be at least 3 characters long').trim(),
  body('email').isEmail().trim().isString().withMessage('Oops email must be a valid email!'),
  body('password').isLength({ min: 3, max: 20}).withMessage('Oops password must contain a special character'),
], 
authController.postSignup);

router.post('/login', authController.postLogin);

router.get('/logout', authController.postLogout);
router.get('/reset-password', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);
router.get('/reset-password/:resetPasswordToken', authController.getResetPasswordWithToken);
router.post('/reset-password/:resetPasswordToken', authController.postResetPasswordWithToken);

router.get('/search', shopController.getSearch);

module.exports = router;