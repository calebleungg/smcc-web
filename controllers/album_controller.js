const Album = require('../models/Album')
const cloudinary = require('cloudinary').v2

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

const deletePhotoById = (req, res) => {
    const publicId = 'smcc/' + req.params.id
    console.log(publicId)

    Album.updateOne(
        { "photos.publicId": publicId },
        { $pull: { "photos" : {"publicId": publicId} } }
    ).then(response => {
        console.log('db', response)
        cloudinary.api.delete_resources([publicId],
            (error, result) => {
                console.log('deleting from cloud')
                if (error) {
                    console.log(error)
                    return res.send(err)
                }
                res.send({success: true, response: result})
        });
    })
    .catch(err => {
        console.log(err)
        res.send(err)
    })
    
}

const deleteAlbumById = (req, res) => {
    Album.findById(req.params.id)
        .then(album => {

            if (album.photos.length > 0 ) {
                let toDelete = []
    
                album.photos.map(photo => {
                    toDelete.push(photo.publicId)
                })
    
                cloudinary.api.delete_resources(toDelete,
                    (error, result) => {
                        if (error) {
                            console.log(error)
                            return res.send(error)
                        }
                        res.send(result)
                        
                        Album.findByIdAndDelete(req.params.id)
                            .then(response => {
                                console.log(response)
                                res.send('successfully deleted')
                            })
                            .catch(err => {
                                console.log(err)
                                res.send(err)
                            })
    
                });
            } else {
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
        })
}

const uploadPhoto = (req, res) => {

    const { comment, url, publicId } = req.body

    let newPhoto = {
        comment: comment, 
        url: url,
        publicId: publicId
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

const updateAlbum = (req, res) => {
    const { name, description } = req.body
    Album.findByIdAndUpdate(req.params.id, {name: name, description: description}, {new: true})
        .then(response =>{
            console.log(response)
            res.send(response)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

const updatePhoto = (req, res) => {
    const id = 'smcc/' + req.params.id
    Album.updateOne(
        { "photos.publicId": id },
        { $set : { "photos.$.comment": req.body.comment } }
    ).then(response => {
        console.log(response)
        res.send(response)
    })
    .catch(err => {
        console.log(err)
        res.send(err)
    })
}

const changePublic = (req, res) => {
    const { status } = req.body

    Album.findByIdAndUpdate(req.params.id, {public: status}, {new: true})
        .then(response => {
            console.log(response)
            res.send(response)
        })
        .catch(err => res.send(err))

}

const adminFix = (req, res) => {
    cloudinary.api.resources(
        { type: 'upload', max_results: 50 }, 
        (error, result) => {
            if (error) {
                console.log(error)
                return res.send('error getting pictures')
            }
            const list = result.resources

            Album.find()
                .then(albums => {
                    albums.map(album => {
                        let newPhotos = album.photos
                        newPhotos.map(photo => {
                            for(let image of list) {
                                if (image.secure_url === photo.url) {
                                    photo.publicId = image.public_id
                                    // Album.updateOne( 
                                    //     {_id: album._id, "photos.url": image.secure_url },
                                    //     { $update: {"photos.publicId": `${image.public_id}`} }
                                    // ).then(response => console.log(response))
                                    // .catch(err => console.log(err))
                                }
                            }
                        })
                        Album.findByIdAndUpdate(album._id, {photos: newPhotos}, {
                            new: true
                        }).then(response => console.log(response))
                        .catch(err => console.log(err))
                    })
                }).catch(err => console.log(err))

            res.send(list)
        });

    // cloudinary.api.delete_resources(['smcc/ven_f1tytb'],
    //     (error, result) => {
    //         if (error) {
    //             console.log(error)
    //             return res.send(err)
    //         }
    //         res.send(result)
    // });


}

module.exports = { uploadPhoto, getAlbums, getAlbumById, createAlbum, getPublicAlbums, adminFix, deleteAlbumById, deletePhotoById, updateAlbum, updatePhoto, changePublic }