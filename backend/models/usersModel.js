import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  categoryName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["incomes", "expenses"],
    required: true,
  },
});

const transactionsTotalSchema = new Schema({
  incomes: {
    type: Number,
    default: 0,
  },
  expenses: {
    type: Number,
    default: 0,
  },
});

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    avatarURL: {
      type: String,
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    sid: { 
      type: String, 
      default: null ,
    },
    currency: {
      type: String,
      default: "usd",
    },
    categories: {
      incomes: [categorySchema],
      expenses: [categorySchema],
    },
    transactionsTotal: {
      type: transactionsTotalSchema,
      default: () => ({}),
    },
  },
  { versionKey: false }
);

const User = model("user", userSchema);

export { User };
