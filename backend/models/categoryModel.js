import mongoose from "mongoose";
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

const Category = model("Category", categorySchema);

export { Category };
