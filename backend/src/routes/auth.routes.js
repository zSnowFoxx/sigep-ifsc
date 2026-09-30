const { Router } = require('express');

const controller = require('../controllers/auth.controller');
const {
  validateOtpRequest,
  validateOtpVerify,
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword
} = require('../validators/auth.validator');

const router = Router();

router.post('/login', validateLogin, controller.login);
router.post('/otp', validateOtpRequest, controller.requestOtp);
router.post('/otp/verify', validateOtpVerify, controller.verifyOtp);
router.post('/register', validateRegister, controller.register);
router.post('/forgot-password', validateForgotPassword, controller.forgotPassword);
router.post('/reset-password', validateResetPassword, controller.resetPassword);
router.post('/change-password', validateChangePassword, controller.changePassword);

module.exports = router;
