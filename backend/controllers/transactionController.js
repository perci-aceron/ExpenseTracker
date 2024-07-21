import mongoose from "mongoose";
import { httpError } from "../helpers/httpError.js";
import { User } from "../models/usersModel.js";
import { Category } from "../models/categoryModel.js";
import { Transaction } from "../models/transactionModel.js";
import getCurrentDateTime from "../utils/getTimeDate.js";

//POST/transactions
const createTransaction = async (req, res) => {
  const { type, categoryName, sum, comment } = req.body;
  const userId = req.user._id;

  if (!type || !sum || !categoryName) {
    throw httpError(400, "Type, sum, and categoryName are required");
  }

  if (!["incomes", "expenses"].includes(type)) {
    throw httpError(400, "Invalid type. Must be 'incomes' or 'expenses'");
  }

  // Find user
  const user = await User.findById(userId);

  if (!user) {
    throw httpError(404, "User not found");
  }

  // Check if category exists
  let category = await Category.findOne({ categoryName, type });

  if (!category) {
    // If category doesn't exist, create a new one
    category = new Category({
      _id: new mongoose.Types.ObjectId(), // Generate new category ID
      categoryName, // Category name from request body
      type, // 'incomes' or 'expenses'
    });

    await category.save();
  }
  // Get current date and time
  const { date, time } = getCurrentDateTime();

  // Create a new transaction
  const newTransaction = new Transaction({
    user: userId,
    type, // 'incomes' or 'expenses'
    date,
    time,
    category: new mongoose.Types.ObjectId(),
    sum,
    comment,
  });

  // Save the transaction to the database
  await newTransaction.save();

  // Update user's transactionsTotal
  if (type === "incomes") {
    user.transactionsTotal.incomes += sum;
  } else if (type === "expenses") {
    user.transactionsTotal.expenses += sum;
  }

  await user.save();

  res.status(201).json(newTransaction);
};
//GET/transaction{type}
const getTransactionsByTypeAndDate = async (req, res) => {
  const { type } = req.params;
  const { date } = req.query;
  const userId = req.user._id;

  if (!["incomes", "expenses"].includes(type)) {
    throw httpError(
      400,
      "Invalid request, type must be one of [incomes, expenses]"
    );
  }

  const query = { type, user: userId };
  if (date) {
    query.date = date;
  }

  try {
    const transactions = await Transaction.find(query).populate({
      path: "category",
      select: "categoryName type", // Ensure you are selecting the fields you need
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//DELETE/transaction{type}
const deleteTransaction = async (req, res) => {
  const { type, id } = req.params;
  const userId = req.user._id;

  if (!["incomes", "expenses"].includes(type)) {
    throw httpError(400, "Invalid type. Must be 'incomes' or 'expenses'");
  }

  try {
    // Find the transaction
    const transaction = await Transaction.findOne({
      _id: id,
      user: userId,
      type,
    });

    if (!transaction) {
      throw httpError(404, "Transaction not found");
    }

    // Remove the transaction
    await Transaction.deleteOne({ _id: id });

    // Update user's transactionsTotal
    const user = await User.findById(userId);

    if (type === "incomes") {
      user.transactionsTotal.incomes -= transaction.sum;
    } else if (type === "expenses") {
      user.transactionsTotal.expenses -= transaction.sum;
    }

    await user.save();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//PATCH/transaction{type}{id}
const updateTransaction = async (req, res) => {
  const { type, id } = req.params;
  const { date, time, category, sum, comment } = req.body;
  const userId = req.user._id;

  if (!["incomes", "expenses"].includes(type)) {
    throw httpError(
      400,
      "Invalid request, type must be one of [incomes, expenses]"
    );
  }

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw httpError(404, "User not found");
  }

  // Find the transaction
  const transaction = await Transaction.findOne({
    _id: id,
    user: userId,
    type,
  });

  if (!transaction) {
    throw httpError(404, "Transaction not found");
  }

  // Update the transaction
  transaction.date = date || transaction.date;
  transaction.time = time || transaction.time;
  transaction.category = category || transaction.category;
  transaction.sum = sum || transaction.sum;
  transaction.comment = comment || transaction.comment;

  await transaction.save();

  // If sum has changed, update user's transactionsTotal
  if (sum && sum !== transaction.sum) {
    if (type === "incomes") {
      user.transactionsTotal.incomes =
        user.transactionsTotal.incomes - transaction.sum + sum;
    } else if (type === "expenses") {
      user.transactionsTotal.expenses =
        user.transactionsTotal.expenses - transaction.sum + sum;
    }

    await user.save();
  }

  res.status(200).json(transaction);
};

export {
  createTransaction,
  getTransactionsByTypeAndDate,
  deleteTransaction,
  updateTransaction,
};
