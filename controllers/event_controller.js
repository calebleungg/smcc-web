const Event = require('../models/Event')

const getEvents = (req, res) => {
    Event.find()
        .then(events => {
            res.send(events)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

const createEvent = (req, res) => {
    const { name, date, time, description } = req.body

    let newEvent = new Event({ name, date, time, description })
    newEvent.save()
        .then(response => {
            res.send(response)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

const deleteEvent = (req, res) => {
    Event.findByIdAndDelete(req.params.id)
        .then(response => {
            console.log('event added')
            res.send(response)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

module.exports = { getEvents, createEvent, deleteEvent }