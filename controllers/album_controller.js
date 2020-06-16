const Album = require('../models/Album')

const getAlbums = (req, res) => {
    Album.find()
        .then(albums => {
            res.send(albums)
        })
        .catch(err => res.send(err))
}

const getPublicAlbums = (req, res) => {
    Album.find({"public": true})
        .then(response => {
            res.send(response)
        })
        .catch(err => res.send(err))
}

const getAlbumById = (req, res) => {
    Album.findById(req.params.id)
        .then(album => {
            res.send(album)
        })
        .catch(err => res.send(err))
}

const createAlbum = (req, res) => {

    const { name, description } = req.body
    let newAlbum = new Album({ name, description })
    newAlbum.save()
        .then(response => {
            console.log(response)
            res.send('succesfully created new album')
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

const deleteAlbumById = (req, res) => {
    Album.findByIdAndDelete(req.params.id)
        .then(response => {
            console.log(response)
            res.send('successfully deleted')
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

const uploadPhoto = (req, res) => {

    const { comment, url } = req.body

    let newPhoto = {
        comment: comment, 
        url: url
    }

    Album.findByIdAndUpdate(req.params.id, { $push: {"photos": newPhoto } }, {new: true} )
        .then(response => {
            console.log(response)
            res.send('photo added')
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
} 

const adminFix = (req, res) => {
    Album.find()
        .then(albums => {
            albums.map(album => {
                Album.findByIdAndUpdate(album._id, {public: true}, {new:true})
                    .then(response => console.log(response))
            })
        })

    res.send('fixing')
}

module.exports = { uploadPhoto, getAlbums, getAlbumById, createAlbum, getPublicAlbums, adminFix, deleteAlbumById }