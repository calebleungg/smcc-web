const Post = require('../models/Post')
const cloudinary = require('cloudinary').v2

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
    const { content, user, media } = req.body

    const newPost = new Post({content, user, created_at, media})
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

                if (post.media) {
                    cloudinary.api.delete_resources([post.media.publicId],
                        (error, result) => {
                            console.log('deleting from cloud')
                            if (error) {
                                console.log(error)
                            }
                            console.log(result)
                    });
                }

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

const makeComment = (req, res) => {

    const date = Date.now()
    const { user, comment, postData } = req.body
    let newComment = {
        user: user,
        comment: comment,
        created_at: date
    }

    Post.findByIdAndUpdate(postData._id, { $push: {"comments": newComment } }, {new: true} )
        .then(response => {
            console.log(response)
            res.send('comment added')
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

const deleteComment = (req, res) => {

    Post.updateOne(
        { "comments._id": req.params.id },
        { $pull: { "comments" : {"_id": req.params.id} } }
    ).then(response => {
        console.log(response)
        res.send(response)
    })
    .catch(err => {
        console.log(err)
        res.send(err)
    })
}

module.exports = { getPosts, makePost, deletePost, editPost, makeComment, deleteComment }