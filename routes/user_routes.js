const express = require('express');
const router = express.Router();

const { getUsers } = require('../controllers/user_controller')

const { isAdmin } = require('../utils/common_utilities')

router.get('/', getUsers)

module.exports = router;