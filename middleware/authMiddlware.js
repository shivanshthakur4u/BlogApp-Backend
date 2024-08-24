import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  // check token
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  // validate token is valid or not
  try {
    const decoded = jwt.verify(
      token.replace("Bearer", ""),
      process.env.JWT_SECRET
    );
    // set user
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid Token Provided",
    });
  }
};

export default authMiddleware;
