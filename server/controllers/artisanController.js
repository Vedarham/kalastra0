import Artisan from "../models/Artisan.model.js";

export const createArtisanProfile = async (req, res) => {
  try {
    const artisan = await Artisan.create({
      user: req.user._id,
      ...req.body,
    });
    res.status(201).json({ success: true, artisan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getArtisanProfile = async (req, res) => {
  try {
    const artisan = await Artisan.findById(req.params.id).populate("products");
    if (!artisan) return res.status(404).json({ message: "Artisan not found" });
    res.status(200).json({ success: true, artisan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateArtisanProfile = async (req, res) => {
  try {
    const artisan = await Artisan.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true }
    );
    if (!artisan) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json({ success: true, artisan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listArtisans = async (req, res) => {
  try {
    const artisans = await Artisan.find().populate("user", "name email");
    res.status(200).json({ success: true, artisans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
