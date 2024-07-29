import "dotenv/config";
import Jimp from "jimp";
import path from "path";
import gravatar from "gravatar";
import fs from "fs/promises";
import { User } from "../models/usersModel.js";
import { emailValidation } from "../validations/validation.js";
import { httpError } from "../helpers/httpError.js";
import { sendEmail } from "../helpers/sendEmail.js";

const { PORT } = process.env;

const getGravatarUrl = (email) => gravatar.url(email, { protocol: "http" });

//users/current
const getCurrentUsers = async (req, res) => {
  try {
    const { _id, name, email, avatarURL, currency, categories, transactionsTotal } = req.user;
    const gravatarURL = getGravatarUrl(email);

    res.json({
      _id,
      name: name || "No name provided",
      email,
      avatarURL: avatarURL || gravatarURL,
      currency,
      categories,
      transactionsTotal
    });
  } catch (error) {
    console.error("Error fetching current user:", error); // Log the error
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//users/info
const updateUserInfo = async (req, res) => {
  const { _id } = req.user; // Assuming user ID is available in req.user
  const updateFields = req.body;

  if (Object.keys(updateFields).length === 0) {
    throw httpError(400, "At least one field is required");
  }

  const updatedUser = await User.findByIdAndUpdate(_id, updateFields, { new: true });
  
  if (!updatedUser) {
    throw httpError(404, "User not found");
  }

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    currency: updatedUser.currency
  });
};
//users/avatar
const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { avatarUrl } = req.body; // Check for avatarUrl from the request body

  if (avatarUrl) {
    // Handle URL update
    await User.findByIdAndUpdate(_id, { avatarURL: avatarUrl });
    return res.status(200).json({ avatarURL: avatarUrl });
  }

  // Handle file upload if avatarUrl is not provided
  if (req.file) {
    const { path: oldPath, originalname } = req.file;

    await Jimp.read(oldPath).then((image) =>
      image.cover(250, 250).write(oldPath)
    );

    const extension = path.extname(originalname);
    const filename = `${_id}${extension}`;

    const newPath = path.join("public", "avatars", filename);
    await fs.rename(oldPath, newPath);

    let avatarURL = path.join("/avatar", filename);
    avatarURL = avatarURL.replace(/\\/g, "/");

    await User.findByIdAndUpdate(_id, { avatarURL });
    res.status(200).json({ avatarURL });
  } else {
    res.status(400).json({ message: "No file or URL provided" });
  }
};
//DELETE/users/avatar
const deleteAvatar = async (req, res) => {
  const { _id } = req.user;
  // Find the user by ID
  const user = await User.findById(_id);
  if (!user) {
    throw httpError(404, "User not found");
  }
  // Get the current avatar URL
  const { avatarURL } = user;
  if (!avatarURL) {
    throw httpError(400, "No avatar to delete");
  }
  // Check if avatarURL is an external URL
  if (avatarURL.startsWith('http://') || avatarURL.startsWith('https://')) {
    // It's an external URL, just update the user record
    await User.findByIdAndUpdate(_id, { avatarURL: null });
    return res.status(204).send();
  }
  // Handle local file path
  const filePath = path.join("public", avatarURL);
  // Log file path
  console.log("Deleting file:", filePath);
  // Delete the avatar file
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Error deleting file:", error.message);
    throw httpError(500, "Error deleting avatar file");
  }
  // Update the user's avatarURL field to null
  await User.findByIdAndUpdate(_id, { avatarURL: null });

  res.status(204).send();
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
    subject: "Action Required: Please Verify Your Email",
    html: `<a target="_blank" href="http://localhost:${PORT}/api/users/verify/${user.verificationToken}">Click to verify your email</a>`,
  });

  res.json({ message: "Verification email sent" });
};

export {
  getCurrentUsers,
  updateUserInfo,
  updateAvatar,
  deleteAvatar,
  verifyEmail,
  resendVerifyEmail,
};
