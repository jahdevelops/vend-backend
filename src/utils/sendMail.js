const nodemailer = require("nodemailer");

const sendEmail = async(options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.smpt_host,
        port: process.env.smpt_port,
        service: process.env.smpt_service,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.smpt_mail,
            pass: process.env.smpt_password,
        },
    });
    const mailOptions = {
        from: process.env.SMPT,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;