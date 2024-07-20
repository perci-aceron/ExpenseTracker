import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import { createCategory } from "../../controllers/categoryController.js";
import { authenticateToken } from "../../middlewares/authenticateToken.js";

const router = express.Router();

router.post("/", authenticateToken, createCategory);

export default router;
