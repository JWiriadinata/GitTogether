const jwt = require("jsonwebtoken");

/** Attaches req.user when a valid Bearer token is sent; otherwise req.user is null. */
const optionalJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    req.user = null;
    return next();
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      req.user = null;
      return next();
    }
    const userId = decoded?.user?.id || decoded?.id;
    req.user = userId ? { id: userId } : null;
    next();
  });
};

module.exports = optionalJWT;
