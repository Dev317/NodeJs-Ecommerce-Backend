const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const UserController = require('../controllers/userController');

router.post('/signup', UserController.signUp);

router.post('/login', UserController.logIn);

router.delete('./:userId', checkAuth, UserController.deleteUserById);

module.exports = router;