const Post = require('../models/Post')

const getPosts = (req, res) => {
    Post.find()
        .then(response => {
            console.log(response)
            res.send(response)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

const makePost = (req, res) => {
    const created_at = Date.now()
    const { content, user } = req.body

    const newPost = new Post({content, user, created_at})
    newPost.save()
        .then(response => {
            console.log(response)
            res.send(response)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })

}

module.exports = { getPosts, makePost }