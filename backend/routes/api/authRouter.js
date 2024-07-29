import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import {
  signupUser,
  loginUser,
  logoutUser,
  refreshTokens,
} from "../../controllers/authController.js";
import authenticateToken from "../../middlewares/authenticateToken.js";

const router = express.Router();

router.post("/register", ctrlWrapper(signupUser));

router.post("/login", ctrlWrapper(loginUser));

router.get("/logout", authenticateToken, ctrlWrapper(logoutUser));

router.post("/refresh", ctrlWrapper(refreshTokens));

export default router;
