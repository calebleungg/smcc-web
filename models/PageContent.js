const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PageContent = new Schema ({
    name: {
        type: String
    },
    content: {
        type: String
    }
})


module.exports = mongoose.model('PageContent', PageContent)