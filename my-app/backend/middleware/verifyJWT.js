const jwt = require('jsonwebtoken');

// Main change: verify JWT and attach a minimal user object (id) to req.user
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden, invalid token' });
        }

        // Support tokens that store the user id either directly or under decoded.user.id
        const userId = decoded?.user?.id || decoded?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authorized, invalid token payload' });
        }

        req.user = { id: userId };
        req.roles = decoded.roles || [];

        next();
    });
};

module.exports = verifyJWT;
