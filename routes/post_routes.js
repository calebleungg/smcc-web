const express = require('express');
const router = express.Router();
const { getPosts, makePost } = require('../controllers/post_controller')
const { isAdmin, userAuthenticated } = require('../utils/common_utilities')


router.get('/', userAuthenticated, getPosts)

router.post('/create', userAuthenticated, makePost)



module.exports = router