const jwt = require('jsonwebtoken');

// **Middleware for JWT Validation**
const jwtMiddleware = (req, res, next) => {
    const token = req.headers['todojwt'];

    if (!token) {
        return res.status(401).json({ status: false, message: "Unauthorized: Token missing" });
    }

    try {
        const decoded = jwt.verify(token, 'mytodo'); // Ensure the secret matches with token generation
        req.user = decoded.jwtuser; // Attach user info to the request object
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        res.status(403).json({ status: false, message: "Unauthorized: Invalid or expired token" });
    }
};

module.exports={
    jwtMiddleware
}