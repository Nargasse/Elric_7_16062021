const express = require('express');
const router = express.Router();

const authControl = require('../controllers/auth');
const tokenControl = require('../middleware/tokenVerification');
const rateLimiter = require('../middleware/retry-limiter');

router.post('/signup', rateLimiter, authControl.createUser);
router.post('/login', rateLimiter, authControl.validateUser);
router.delete('/suppress/:userID', rateLimiter, tokenControl, authControl.suppressUser);

module.exports = router;