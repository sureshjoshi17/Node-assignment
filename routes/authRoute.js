const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');

authRouter.route('/sendOtp').post([], authController.sendOtp);
authRouter.route('/login').post([], authController.login);


module.exports = authRouter;