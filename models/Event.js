const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Event = new Schema ({
    name: {
        type: String
    },
    date: {
        type: Date
    },
    time: {
        type: String
    },
    description: {
        type: String
    }
})


module.exports = mongoose.model('Event', Event)