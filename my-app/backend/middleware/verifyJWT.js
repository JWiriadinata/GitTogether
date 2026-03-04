const jwt = require('jsonwebtoken');
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
        req.user = decoded.user;
        //req.user = decoded;
        req.roles = decoded.roles;
        next();
    });
};
    
module.exports = verifyJWT;
