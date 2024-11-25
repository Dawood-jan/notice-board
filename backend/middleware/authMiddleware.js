const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization; // Use lowercase 'authorization'

  if (authorization && authorization.startsWith("Bearer")) {
    const token = authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
      if (error) {
        return res.status(403).json({ message: "Unauthorized, Invalid token" });
      }

      // Construct req.user based on role
      req.user = {
        id: decoded.id,
        fullname: decoded.fullname,
        email: decoded.email,
        role: decoded.role,
        department: decoded.department,
      };

      // Include semester only for students
      if (decoded.role === "student") {
        req.user.semester = decoded.semester;
      }

      next(); // Proceed to the next middleware or controller
    });
  } else {
    return res.status(401).json({ message: "Unauthorized. No token" });
  }
};

module.exports = authMiddleware;
