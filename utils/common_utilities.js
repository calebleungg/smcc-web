// middleware functions
const userAuthenticated = function (req, res, next) {
    console.log('in userAuthenticated got req.user', req.user)
    console.log('in userAuthenticated got req.session', req.session)
    console.log('in userAuthenticated got req.sessionID', req.sessionID)
    if (req.isAuthenticated()) {
        next();
    } else {
        res.sendStatus(403);
    }
}

const isAdmin = function (req, res, next) {
    if (req.user.role === 'admin') return next();
    else res.sendStatus(403);
}

const handleError = function(req, res) {
	const {status=500, message} = req
	res.status(status);
	res.send(message);
}

module.exports = {
    isAdmin,
	userAuthenticated,
	handleError
};