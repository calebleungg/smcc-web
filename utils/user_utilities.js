const User = require('../models/User');

const deleteUser = function (req) {
    return User.findByIdAndRemove(req.params.id);
}

const updateUser = function (req) {
    return User.findByIdAndUpdate(req.params.id, req.body);
}

// middleware function
async function checkRequiresAdmin(req, res, next) {
    // If block value is passed in body, make sure it can be updated
    if (req.body.blocked) {
        await User.findById(req.params.id).exec((err, user) => {
            if (err) {
				req.message = err.message;
				return handleError(req, res);
            }
            // if user.blocked isn't set, we only care if we have admin user if blocked is being set to true
            // if user.blocked is set, we want to make sure user is admin if it is being changed
            if ((user.blocked && user.blocked.toString() != req.body.blocked) ||
                !user.blocked && req.body.blocked == 'true') {
                if (req.user.role !== 'admin') {
                    // Trying to block/unblock user and not admin
					req.stats = 403;
					req.message = 'Only admin can block/unblock a user';
					return handleError(req, res);
                }
            }
            next();
        });
    }
}

module.exports = {
    deleteUser,
	updateUser,
	checkRequiresAdmin
};