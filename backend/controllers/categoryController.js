import { User } from "../models/usersModel.js";
import { Category } from "../models/categoryModel.js";
import { httpError } from "../helpers/httpError.js";
import mongoose from "mongoose";

//POST/categories
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
//GET/categories
const getCategories = async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    throw httpError(404, "User not found");
  }

  const { incomes, expenses } = user.categories;

  res.status(200).json({ incomes, expenses });
};
//PATCH/categories/{id}
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName } = req.body;
  const userId = req.user._id;

  if (!categoryName) {
    throw httpError(400, "Category name is required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw httpError(404, "User not found");
  }

  let category = null;
  let categoryType = "";

  for (const type of ["incomes", "expenses"]) {
    category = user.categories[type].find((cat) => cat._id.toString() === id);
    if (category) {
      categoryType = type;
      break;
    }
  }

  if (!category) {
    throw httpError(404, "Category not found");
  }

  category.categoryName = categoryName;

  await user.save();

  res.status(200).json(category);
};
//DELETE/categories/{id}
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    throw httpError(404, "User not found");
  }

  let categoryIndex = -1;
  let categoryType = "";

  for (const type of ["incomes", "expenses"]) {
    categoryIndex = user.categories[type].findIndex((cat) => cat._id.toString() === id);
    if (categoryIndex !== -1) {
      categoryType = type;
      break;
    }
  }

  if (categoryIndex === -1) {
    throw httpError(404, "Category not found");
  }

  user.categories[categoryType].splice(categoryIndex, 1);

  await user.save();

  res.status(204).send();
};

export { createCategory, getCategories, updateCategory,deleteCategory };
