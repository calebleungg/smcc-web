const Post = require('../models/Post')

const getPosts = (req, res) => {
    Post.find().sort( { created_at: -1 } )
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

const deletePost = (req, res) => {

    console.log(req.params.id)
    console.log(req.user)

    Post.findById(req.params.id)
        .then(post => {
            if (String(post.user.id) === String(req.user._id)) {
                post.delete()
                    .then(response => {
                        console.log(response)
                        res.send(response)
                    })
                    .catch(err => {
                        console.log(err)
                        res.send(err)
                    })
            }
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

const editPost = (req, res) => {

    const { content, postData } = req.body

    Post.findById(postData._id)
        .then(post => {
            if (String(postData.user.id) === String(req.user._id)) {
                post.update({content: content}, {new: true})
                .then(response => {
                    console.log(response)
                    res.send(response)
                })
                .catch(err => {
                    console.log(err)
                    res.send(err)
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

module.exports = { getPosts, makePost, deletePost, editPost }