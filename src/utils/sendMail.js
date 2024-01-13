/* eslint-disable no-undef */
const nodemailer = require("nodemailer");
const { mail } = require("../config");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: mail.host,
    port: mail.port,
    service: mail.service,
    secure: false,
    requireTLS: true,
    auth: {
      user: mail.user,
      pass: mail.pass,
    },
  });
  const mailOptions = {
    from: mail.smpt,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
