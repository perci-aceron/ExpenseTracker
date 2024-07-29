import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import authenticateToken from "../../middlewares/authenticateToken.js";
import {
  createTransaction,
  getTransactionsByTypeAndDate,
  deleteTransaction,
  updateTransaction,
} from "../../controllers/transactionController.js";

const router = express.Router();

router.post("/", authenticateToken, ctrlWrapper(createTransaction));

router.get(
  "/:type",
  authenticateToken,
  ctrlWrapper(getTransactionsByTypeAndDate)
);

router.delete("/:type/:id", authenticateToken, ctrlWrapper(deleteTransaction));

router.patch("/:type/:id", authenticateToken, ctrlWrapper(updateTransaction));

export default router;
