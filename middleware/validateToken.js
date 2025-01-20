const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
      console.log("Decoded Token:", decoded); // Log for debugging

      if (!decoded.user || !decoded.user._id) {
        res.status(401);
        throw new Error("User ID is missing in the token");
      }

      // Map `_id` to `id` for consistency
      req.user = { id: decoded.user._id, ...decoded.user };
      next();
    });
  } else {
    res.status(401);
    throw new Error("Authorization token is missing or invalid");
  }
});

module.exports = validateToken;
