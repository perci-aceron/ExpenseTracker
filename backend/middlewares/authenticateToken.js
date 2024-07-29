// Example authentication middleware
import jwt from "jsonwebtoken";
import { User } from "../models/usersModel.js";

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

export default authenticateToken;
