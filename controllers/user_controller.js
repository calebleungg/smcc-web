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
            if (user.avatar && user.avatar.publicId) {
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

const updateDetails = (req, res) => {

    const { firstName, lastName, phone, yearGraduated, country, address } = req.body
    const newDetails = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        yearGraduated: yearGraduated,
        country: country,
        address: address
    }
    User.findByIdAndUpdate(req.params.id, newDetails, {new: true})
        .then(response => {
            console.log(response)
            res.send(response)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

const changePassword = (req, res) => {
    
    const { email, oldPassword, newPassword } = req.body

    User.findByUsername(email)
        .then(user => {
            user.changePassword(oldPassword, newPassword)
                .then(response => {
                    console.log(response)
                    res.send(response)
                })
                .catch(err => {
                    console.log(err)
                    res.send(err)
                })
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

const deleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(response => {
            console.log(response)
            res.send(response)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

const resetPassword = (req, res) => {
    const { email, reset } = req.body
    console.log('new password', reset)
    User.findByUsername(email)
        .then(user => {
            user.setPassword(reset)
                .then(response => {
                    response.save()
                        .then(response => {
                            console.log(response)
                            res.send(response)
                        })
                        .catch(err => res.send(err))
                })
                .catch(err => {
                    console.log(er)
                    res.send(err)
                })
        })
}

module.exports = { getUsers, updateAvatar, updateDetails, changePassword, deleteUser, resetPassword }