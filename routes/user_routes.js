const express = require('express');
const router = express.Router();

const { getUsers, updateAvatar } = require('../controllers/user_controller')
const { isAdmin, userAuthenticated } = require('../utils/common_utilities')

router.get('/', getUsers)

router.put('/update/avatar/:id', userAuthenticated, updateAvatar)

module.exports = router;