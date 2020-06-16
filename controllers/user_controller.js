const User = require('../models/user');
const cloudinary = require('cloudinary').v2

const getUsers = (req, res) => {
    User.find()
        .then(response => {
            console.log(response)
            res.send(response)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

const updateAvatar = (req, res) => {

    const { url, publicId } = req.body 

    const newAvatar = {
        avatar: {
            url: url,
            publicId: publicId
        }
    }

    User.findById(req.params.id)
        .then(user => {
            const id = user._id
            if (user.avatar.publicId) {
                cloudinary.api.delete_resources([user.avatar.publicId],
                    (error, result) => {
                        console.log('deleting avatar from cloud')
                        if (error) {
                            console.log(error)
                            return res.send(err)
                        }
                        console.log(result)
                    });
            }

            User.findByIdAndUpdate(id, newAvatar, {new: true})
                .then(response => {
                    console.log(response)
                    res.send(response)
                })
                .catch(err => console.log(err))
        })

}

module.exports = { getUsers, updateAvatar }