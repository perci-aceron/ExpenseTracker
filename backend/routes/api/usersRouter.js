import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import {
  signupUser,
  loginUser,
  logoutUser,
  refreshTokens,
  getCurrentUsers,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} from "../../controllers/authController.js";
import { authenticateToken } from "../../middleWares/authenticateToken.js";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

router.post("/auth/register", ctrlWrapper(signupUser));

router.post("/auth/login", ctrlWrapper(loginUser));

router.get("/auth/logout", authenticateToken, ctrlWrapper(logoutUser));

router.post("/auth/refresh", ctrlWrapper(refreshTokens));

router.get("/current", authenticateToken, ctrlWrapper(getCurrentUsers));

router.patch(
  "/avatars",
  authenticateToken,
  upload.single("avatar"),
  ctrlWrapper(updateAvatar)
);

router.get("/verify/:verificationToken", ctrlWrapper(verifyEmail));

router.post("/verify", authenticateToken, ctrlWrapper(resendVerifyEmail));

export default router;
