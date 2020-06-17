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
        type: String
    },
    role: {
        type: String,
    },
    blocked: {
        type: Boolean,
        default: false
    },
    avatar: {
        url: String,
        publicId: String
    },
    created_at: {
        type: Date
    }
});

// plugin the passport-local-mongoose middleware with our User schema
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);