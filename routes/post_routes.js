const express = require('express');
const router = express.Router();
const { getPosts, makePost, deletePost, editPost } = require('../controllers/post_controller')
const { isAdmin, userAuthenticated } = require('../utils/common_utilities')


router.get('/', userAuthenticated, getPosts)

router.post('/create', userAuthenticated, makePost)


router.put('/edit', userAuthenticated, editPost)

router.delete('/delete/:id', userAuthenticated, deletePost, editPost)



module.exports = router