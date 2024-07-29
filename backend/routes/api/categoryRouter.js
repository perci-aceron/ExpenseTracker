import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import authenticateToken from "../../middlewares/authenticateToken.js";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../../controllers/categoryController.js";

const router = express.Router();

router.post("/", authenticateToken, ctrlWrapper(createCategory));

router.get("/", authenticateToken, ctrlWrapper(getCategories));

router.patch("/:id", authenticateToken, ctrlWrapper(updateCategory));

router.delete("/:id", authenticateToken, ctrlWrapper(deleteCategory));

export default router;
