// Middleware to authorize based on user role
//authorizeMiddleware.js
const authorize = (...roles) => {
    return (req, res, next) => {
        // Check if the user role is included in the allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
};

module.exports = authorize;
