const express = require('express')
const router = express.Router()

const { isAdmin, userAuthenticated } = require('../utils/common_utilities')
const { getEvents, createEvent, deleteEvent } = require('../controllers/event_controller')

router.get('/', userAuthenticated, getEvents)

router.delete('/delete/:id', isAdmin, deleteEvent)

router.post('/create', isAdmin, createEvent)

module.exports = router;