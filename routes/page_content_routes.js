const express = require('express');
const router = express.Router();
const { addContent, getContent, updateContent } = require('../controllers/page_content_controller')
const { isAdmin } = require('../utils/common_utilities')


router.get('/', getContent)

router.put('/update', isAdmin, updateContent)

router.post('/create', isAdmin, addContent)

module.exports = router