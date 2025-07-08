const jwt = require('jsonwebtoken');
// load secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// middleware to authenticate user
function authenticate (req, res, next) {
    // get the authorization header from the request
    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader);
    // extract token from the authorization header
    const token = authHeader && authHeader.split(' ')[1];
    if ( !token ) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }
    try {
        // verify the token using jwt.verify
        // if token is valid, it will decode the token and return the payload
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded Token:', decoded);
        // attach user information to the request object
        req.user = decoded;
        next(); // call next middleware or route handler
    } catch (error) {
        // if token is invalid or expired, return 403 Forbidden
        console.error('Token verification error:', error);
        res.status(403).json({ message: 'Invalid token' });
    }
}
// export the authenticate middleware
module.exports = authenticate;