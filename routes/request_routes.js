const express = require('express');
const router = express.Router();

const { getRequests, createRequest, deleteRequest } = require('../controllers/request_controller')

const { isAdmin } = require('../utils/common_utilities')

router.get('/', getRequests)

router.post('/create', createRequest)

router.delete('/delete/:id', isAdmin, deleteRequest)


module.exports = router;