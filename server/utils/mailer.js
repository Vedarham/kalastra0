import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an OTP email to the given address.
 * @param {string} to   - Recipient email
 * @param {string} otp  - 6-digit OTP string
 */
export const sendOTPMail = async (to, otp) => {
  const mailOptions = {
    from: `"Kalastra" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Kalastra Verification Code",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #faf7f4; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #c2724f; font-size: 28px; margin: 0;">Kalastra</h1>
          <p style="color: #888; font-size: 13px; margin: 4px 0 0;">Artisan Marketplace</p>
        </div>

        <h2 style="color: #222; font-size: 20px; margin-bottom: 8px;">Verify your identity</h2>
        <p style="color: #555; font-size: 15px; line-height: 1.6;">
          Use the code below to complete your verification. This code expires in <strong>5 minutes</strong>.
        </p>

        <div style="background: #fff; border: 2px dashed #c2724f; border-radius: 10px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 42px; font-weight: 700; letter-spacing: 10px; color: #c2724f;">${otp}</span>
        </div>

        <p style="color: #999; font-size: 13px; text-align: center;">
          If you did not request this code, please ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
