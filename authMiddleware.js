// authMiddleware.js
import dotenv from "dotenv";

dotenv.config();

export const checkPass = (req, res, next) => {
  const pass = req.query.pass;
  if (pass !== process.env.PASS_HASH) {
    return res.status(401).json({ error: "Authentication Failure!" });
  }
  next();
};
