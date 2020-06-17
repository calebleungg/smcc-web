const express = require('express');
const router = express.Router();

const { getUsers, updateAvatar, updateDetails, changePassword, deleteUser, resetPassword } = require('../controllers/user_controller')
const { isAdmin, userAuthenticated } = require('../utils/common_utilities')

router.get('/', getUsers)

router.put('/update/avatar/:id', userAuthenticated, updateAvatar)
router.put('/update/details/:id', userAuthenticated, updateDetails)
router.put('/password/change', userAuthenticated, changePassword)
router.put('/admin/password-reset', isAdmin, resetPassword)

router.delete('/admin/delete/:id', isAdmin, deleteUser)

module.exports = router;