const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Post = new Schema ({
    content: {
        type: String
    },
    user: {
        id: String,
        avatar: String,
        name: String
    },
    comments: [
        {
            user: {
                id: String,
                avatar: String,
                name: String
            },
            comment: String,
            created_at: Date
        }
    ],
    created_at: {
        type: Date
    },
    media: {
        url: String,
        publicId: String
    }
    
})


module.exports = mongoose.model('Post', Post)