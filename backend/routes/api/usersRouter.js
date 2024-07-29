import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import {
  getCurrentUsers,
  updateAvatar,
  updateUserInfo,
  deleteAvatar,
  verifyEmail,
  resendVerifyEmail
} from "../../controllers/usersController.js";
import authenticateToken from "../../middlewares/authenticateToken.js";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

router.get("/current", authenticateToken, ctrlWrapper(getCurrentUsers));

router.patch("/info", authenticateToken, ctrlWrapper(updateUserInfo));

router.patch("/avatar", authenticateToken, upload.single("avatar"), ctrlWrapper(updateAvatar));

router.delete("/avatar", authenticateToken, ctrlWrapper(deleteAvatar));

router.get("/verify/:verificationToken", ctrlWrapper(verifyEmail));

router.post("/verify", authenticateToken, ctrlWrapper(resendVerifyEmail));

export default router;
