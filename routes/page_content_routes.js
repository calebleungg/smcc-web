const express = require('express');
const router = express.Router();
const { addContent, getContent } = require('../controllers/page_content_controller')


router.get('/', getContent)
router.post('/create', addContent)

module.exports = router