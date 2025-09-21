import User from "../models/User.model.js";
import admin from "firebase-admin";

//  verify Firebase ID Token middleware
// export const verifyToken = async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token provided" });

//   try {
//     const decoded = await admin.auth().verifyIdToken(token);
//     req.firebaseUid = decoded.uid;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// sign in / register
export const registerUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    let user = await User.findOne({ firebaseUid: req.firebaseUid });
    if (!user) {
      user = await User.create({
        firebaseUid: req.firebaseUid,
        name,
        email,
        role,
      });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name } = decodedToken;
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email: email,
        name: name || "New User",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res) => {
  // Firebase handles logout client-side; backend just acknowledges
  res.status(200).json({ success: true, message: "Logged out successfully" });
};