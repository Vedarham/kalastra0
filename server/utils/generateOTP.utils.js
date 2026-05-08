import crypto from "crypto";

export const generateOTP = (length = 6) => {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    const rand = crypto.randomInt(0, digits.length);
    otp += digits[rand];
  }

  return otp;
};

export const hashOTP = (otp) => {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
};