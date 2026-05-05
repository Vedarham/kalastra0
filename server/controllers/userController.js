import User from "../models/User.model.js";
import cloudinary from "../config/cloudinary.js";

export const deleteProfile = async(req,res)=>{
    try {
        const userId = req.user.id;
        await User.findByIdAndDelete(userId);
        res.clearCookie("refreshToken");
        res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        })
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Error Account deletion",
            error: error.message 
        });
    }
}

export const switchToArtisan = async(req,res)=>{
    try {
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        if (user.role === "seller") {
            return res.json({ message: "Already a seller" });
        }

        user.role = "seller";
        if (!user.shopName) user.shopName = `${user.name}'s Shop`;
        await user.save();

        res.json({
        success: true,
        message: "Switched to seller",
        role: user.role
        });

    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Unable to Switched to seller",
            error: error.message });
    }
}

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }
    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    user.password = newPassword;
    user.refreshTokens = [];
    await user.save();

    res.clearCookie("refreshToken");

    res.json({
      success: true,
      message: "Password changed. Please login again."
    });
  } catch (error) {
    res.status(500).json({ 
        success:false,
        message: "Unable to change Password",
        error: error.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(req.file.buffer);
      });

    const result = await streamUpload();

    const user = await User.findById(req.user.id);
    user.avatar = result.secure_url;
    await user.save();

    res.json({
      success: true,
      avatar: result.secure_url
    });
  } catch (error) {
    res.status(500).json({
        success:false,
        message: "Unabel to update Avatar", 
        error: error.message 
    });
  }
};