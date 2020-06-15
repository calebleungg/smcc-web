const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Album = new Schema ({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    public: {
        type: Boolean,
        default: false
    },
    photos: [
        {
           comment: String,
           url: String
        }
    ]
})


module.exports = mongoose.model('Album', Album)