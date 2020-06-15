const passport = require('passport');
const User = require('../models/user')

const register = function (req, res) {
    User.register(
        new User (
            {
                username: req.body.username,
                email: req.body.email
            }
        ),
        // provided separately to user schema
        req.body.password,
        function(err) {
            if (err) {
                res.status(500).json({error: err})
            } else {
                loginUser(req, res);
            }
        }
    )
}

const authenticate = passport.authenticate('local')

function loginUser(req, res) {
    authenticate(req, res, function() {
        res.status(200).json({user: req.user})
    })
}

module.exports = {register, login: loginUser}