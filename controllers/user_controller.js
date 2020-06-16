const User = require('../models/user');

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

module.exports = { getUsers }