import { User } from "../models/usersModel.js";
import { httpError } from "../helpers/httpError.js";
import mongoose from "mongoose";

const createCategory = async (req, res) => {
  const { type, categoryName } = req.body;
  const userId = req.user._id;

  if (!type || !categoryName) {
    throw httpError(400, "Both type and categoryName are required");
  }

  if (!["incomes", "expenses"].includes(type)) {
    throw httpError(400, "Invalid type. Must be 'incomes' or 'expenses'");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw httpError(404, "User not found");
  }

  const newCategory = {
    _id: new mongoose.Types.ObjectId(),
    type,
    categoryName,
  };

  if (type === "incomes") {
    user.categories.incomes.push(newCategory);
  } else if (type === "expenses") {
    user.categories.expenses.push(newCategory);
  }

  await user.save();

  res.status(201).json(newCategory);
};

export { createCategory };
