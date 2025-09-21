import User from "../models/User.model.js";
import Artisan from "../models/Artisan.model.js";

export const deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    await Artisan.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ success: true, message: "Profile deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const switchToArtisan = async (req, res) => {
  try {
    const { shopName, category, bio } = req.body;
    await User.findByIdAndUpdate(req.user._id, { role: "artisan" });
    const artisan = await Artisan.create({
      user: req.user._id,
      shopName,
      category,
      bio,
    });

    res.status(200).json({ success: true, artisan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
