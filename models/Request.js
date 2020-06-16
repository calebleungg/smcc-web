const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Request = new Schema ({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    yearGraduated: {
        type: String,
    },
    country: {
        type: String,
    },
    address: {
        type: String,
    },
    passwordPref: {
        type: String,
    },
    
})


module.exports = mongoose.model('Request', Request)