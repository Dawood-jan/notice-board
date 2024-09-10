const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    const authorization = req.headers.authorization; // Use lowercase 'authorization'

    if (authorization && authorization.startsWith("Bearer")) {
        const token = authorization.split(" ")[1];
        
        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
            if (error) {
                return res.status(403).json({ message: "Unauthorized, Invalid token" });
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({ message: "Unauthorized. No token" });
    }
};

module.exports = authMiddleware;
