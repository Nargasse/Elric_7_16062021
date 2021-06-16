const express = require('express');
const router = express.Router();
const tokenControl = require('../middleware/tokenVerification');

const postControl = require('../controllers/postControl');

router.post('/new', rateLimiter, tokenControl, postControl.saveNewPost);
router.get('/list/:position', rateLimiter, tokenControl, postControl.getPostList);
router.get('/one/:postId', rateLimiter, tokenControl, postControl.getOnePost);
router.put('/edit/:postId', rateLimiter, tokenControl, postControl.editPost);
router.delete('/delete/:postId', rateLimiter, tokenControl, postControl.deletePost);
module.exports = router;