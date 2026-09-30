const transporter = require('../config/mailer.js');

const sendResetEmail = async (toEmail, resetLink) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Reset your ShopEase password',
        html: `
        <p>You requested a password reset.</p>
        <p><a href='${resetLink}'>Click here to reset your password</a></p>
        <p>This Link expires in 15 minutes. if you didn't request this, ignore this email.</p>`,
    });
};

module.exports = sendResetEmail;