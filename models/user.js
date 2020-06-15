const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const User = new Schema({
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    yearGraduated: {
        type: String
    },
    country: {
        type: String
    },
    address: {
        streetNumber: {
            type: String,
        }, 
        street: {
            type: String,
        },
        suburb: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String
        },
        postcode: {
            type: String
        },
        country: {
            type: String,
        },
    },
    role: {
        type: String,
    },
    blocked: {
        type: Boolean,
        default: false
    }
});

// plugin the passport-local-mongoose middleware with our User schema
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);