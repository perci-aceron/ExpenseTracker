import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import "dotenv/config";
import Jimp from "jimp";
import path from "path";
import fs from "fs/promises";
import { User } from "../models/usersModel.js";
import {
  emailValidation,
  signupValidation,
  loginValidation,
} from "../validations/validation.js";
import { httpError } from "../helpers/httpError.js";
import { sendEmail } from "../helpers/sendEmail.js";
import { v4 as uuid4 } from "uuid";

const { SECRET_KEY, REFRESH_SECRET_KEY, PORT } = process.env;

//auth/register
const signupUser = async (req, res) => {
  const { name, email, password, } = req.body;

  const { error } = signupValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  const user = await User.findOne({ email });
  if (user) {
    throw httpError(409, "Provided email already exists");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email, { protocol: "http" });

  const verificationToken = uuid4();

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
    transactionsTotal: { incomes: 0, expenses: 0 },
  });

  await sendEmail({
    to: email,
    subject: "Action Required: Verify Your Email",
    html: `<a target="_blank" href="http://localhost:${PORT}/api/users/verify/${verificationToken}">Click to verify email</a>`,
  });

  res.status(201).json({
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      avatarURL: newUser.avatarURL,
      currency: newUser.currency,
      categories: {
        incomes: newUser.categories.incomes,
        expenses: newUser.categories.expenses,
      },
      transactionsTotal: {
        incomes: newUser.transactionsTotal.incomes,
        expenses: newUser.transactionsTotal.expenses,
      },
    },
  });
};
//auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginValidation.validate(req.body);
  if (error) {
    throw httpError(401, error.message);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(403, "Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw httpError(403, "Email or password is wrong");
  }

  const payload = { id: user._id };
  const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: "30d" });
  const sid = uuid4();// Generate a new session ID

  // Update user with new tokens and session ID
  await User.findByIdAndUpdate(user._id, { token: accessToken, sid });

  res.status(200).json({
    accessToken,
    refreshToken,
    sid,
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      avatarURL: user.avatarURL,
      currency: user.currency,
      categories: user.categories,
      transactionsTotal: user.transactionsTotal,
    },
  });
};
//auth/logout
const logoutUser = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).send();
};
//auth/refresh
const refreshTokens = async (req, res) => {
  const { sid } = req.body;

  if (!sid) {
    throw httpError(400, "No token provided");
  }

  // Find the user by sid
  const user = await User.findOne({ sid });
  if (!user) {
    throw httpError(401, "Unauthorized");
  }

  // Generate new tokens
  const accessToken = jwt.sign({ uid: user._id, sid }, SECRET_KEY, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ uid: user._id, sid }, REFRESH_SECRET_KEY, { expiresIn: "30d" });

  // Send the response
  res.json({ accessToken, refreshToken, sid });
};

const getCurrentUsers = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, originalname } = req.file;

  await Jimp.read(oldPath).then((image) =>
    image.cover(250, 250).write(oldPath)
  );

  const extension = path.extname(originalname);
  const filename = `${_id}${extension}`;

  const newPath = path.join("public", "avatars", filename);
  await fs.rename(oldPath, newPath);

  let avatarURL = path.join("/avatars", filename);
  avatarURL = avatarURL.replace(/\\/g, "/");

  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw httpError(400, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const { error } = emailValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw httpError(404, "The provided email address could not be found");
  }

  if (user.verify) {
    throw httpError(400, "Verification has already been passed");
  }

  await sendEmail({
    to: email,
    subject: "Action Required: Verify Your Email",
    html: `<a target="_blank" href="http://localhost:${PORT}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
  });

  res.json({ message: "Verification email sent" });
};

export {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUsers,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
  refreshTokens
};
