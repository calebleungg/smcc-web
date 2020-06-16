const passport = require('passport');
const User = require('../models/user');
const Request = require('../models/Request')
const {handleError} = require('../utils/common_utilities')

const register = function (req, res) {
    User.register(new User({
        username: req.body.email,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        yearGraduated: req.body.yearGraduated,
        country: req.body.country,
        address: req.body.address,
        role: req.body.role || 'user'
        }), 
        req.body.password, 
        function (err) {
            if (err) {
                if(err.name === 'UserExistsError') {
                    req.status = 409;
                    req.message = err.message;
                    return handleError(req,res);
                } else {
                    req.message = err.message;
                    return handleError(req,res);
                }
            } 
            // Log in the newly registered user
            req.body.username = req.body.email
            // loginUser(req, res);
            console.log('saved new user:', req.body.email)
            if (req.body.requestId) {
                Request.findByIdAndDelete(req.body.requestId)
                    .then(response => {
                        console.log(response)
                        res.send('request approved')
                    })
            }
        }
    );
};

const logout = function (req, res) {
    req.logout();
    console.log('logged out user');
    console.log('session object:', req.session);
    console.log('req.user:', req.user);
    res.sendStatus(200);
}

// helper functions
const authenticate = passport.authenticate('local');

function loginUser(req, res) {
    // passport.authenticate returns a function that we will call with req, res, and a callback function to execute on success    

    authenticate(req, res, function () {
        console.log('authenticated', req.user.username);
        console.log('session object:', req.session);
        console.log('req.user:', req.user);
        console.log('session ID:', req.sessionID);
        res.status(200);
        res.json({user: req.user, sessionID: req.sessionID});
    });
}

function activeUserSession(req,res) {
    console.log('in activeUserSession sessionID', req.sessionID)
    console.log('in activeUserSession user', req.user)
    if(req.sessionID && req.user) {
        res.status(200);
        res.send({
            sessionId: req.sessionID,
            user: req.user
        })
    }
    else {
        res.sendStatus(403);
    }    
}

module.exports = {
    register,
    login: loginUser,
    logout,
    activeUserSession
};