const jwt = require("jsonwebtoken");

/*
|--------------------------------------------------------------------------
| VERIFY TOKEN
|--------------------------------------------------------------------------
| 1. Checks Authorization header
| 2. Extracts Bearer token
| 3. Verifies using JWT_SECRET
| 4. Attaches decoded user to req.user
|--------------------------------------------------------------------------
*/

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No authorization header" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


/*
|--------------------------------------------------------------------------
| ROLE AUTHORIZATION
|--------------------------------------------------------------------------
| Usage:
| allowRoles("admin")
| allowRoles("admin", "recipient")
|--------------------------------------------------------------------------
*/

const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};


module.exports = {
  verifyToken,
  allowRoles
};
