import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../models/usersModel.js";
import {
  signupValidation,
  loginValidation,
} from "../validations/validation.js";
import { httpError } from "../helpers/httpError.js";
import { sendEmail } from "../helpers/sendEmail.js";
import { v4 as uuid4 } from "uuid";

const { SECRET_KEY, REFRESH_SECRET_KEY, PORT } = process.env;

//auth/register
// POST http://localhost:3001/api/auth/register
// body: { "name": "Bob", "email": "user@example.com", "password": "qwer1234"}
const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

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
    subject: "Action Required: Please Verify Your Email",
    html: `<a target="_blank" href="http://localhost:${PORT}/api/users/verify/${verificationToken}">Click to verify your email</a>`,
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
//POST http://localhost:3001/api/auth/login
//body: { "email": "user@example.com", "password": "qwer1234" }
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
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "30d",
  });
  const sid = uuid4(); // Generate a new session ID

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
//GET http://localhost:3001/api/auth/logout
//Headers: Authorization, Bearer (token)
const logoutUser = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).send();
};
//auth/refresh
//POST http://localhost:3001/api/auth/refresh
//body: { "sid": "c0a32f6f-1aba-46cd-a645-97e0104eab5d" }
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
  const accessToken = jwt.sign({ uid: user._id, sid }, SECRET_KEY, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ uid: user._id, sid }, REFRESH_SECRET_KEY, {
    expiresIn: "30d",
  });
  // Send the response
  res.json({ accessToken, refreshToken, sid });
};

export { signupUser, loginUser, logoutUser, refreshTokens };
