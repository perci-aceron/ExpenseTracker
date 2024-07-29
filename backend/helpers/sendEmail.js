// sendEmail.js
import nodemailer from "nodemailer";
import "dotenv/config";
import mockSendEmail from "./mockSendEmail.js";

const { GMAIL_EMAIL, GMAIL_PASSWORD, USE_MOCK_EMAIL } = process.env;

const nodemailerConfig = {
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_EMAIL,
    pass: GMAIL_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  if (USE_MOCK_EMAIL === "true") {
    await mockSendEmail(data);
  } else {
    const email = { ...data, from: GMAIL_EMAIL };
    await transport.sendMail(email);
  }
};

export { sendEmail };
