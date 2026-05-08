import User from "../models/User.model.js";
import Product from "../models/Product.model.js"

export const getMyArtisanProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const products = await Product.find({ artisan: req.user.id, isActive: true });
    if (!user ){
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    if (user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Not an artisan"
      });
    }
    return res.status(200).json({ 
      success: true, 
      artisan: user,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getArtisanProfile = async (req, res) => {
  try {
    const artisan = await User.findById(req.params.id)
    const products = await Product.find({ artisan: artisan._id });
    
    if(!artisan || artisan.role !== "seller") {
      return res.status(404).json({
        success: false,
        message: "Artisan not found"
      });
    }

    return res.status(200).json({ 
      success: true, 
      artisan,
      products
    });

  } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
  }
};

export const updateArtisanProfile = async (req, res) => {
  try {
   const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Not an artisan"
      });
    }

    const { shopName, shopDescription, category, socialLinks } = req.body;

    const allowedCategories = [
      'Jewelry',
      'Pottery',
      'Textiles',
      'Woodwork',
      'Metalwork',
      'Glass',
      'Leather',
      'Paper Crafts',
      'Home Decor',
      'Art',
      'Clothing',
      'Accessories',
      'Toys',
      'Other'
      ];

    if (category && !allowedCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category"
        });
      }

    if (shopName?.trim()) user.shopName = shopName.trim();
    if (shopDescription?.trim()) user.shopDescription = shopDescription.trim();
    if (category) user.category = category;

    if (socialLinks && typeof socialLinks === "object") {
        user.socialLinks = {
          ...user.socialLinks,
          ...socialLinks,
        };
      }
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Artisan profile updated", 
      data: user 
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const listArtisans = async (req, res) => {
  try {
    const artisans = await User.find({ role: "seller" })
      .select("name shopName shopDescription category rating avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      artisans,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getTopCreators = async (req, res) => {
  try {
    const artisans = await User.find({ role: "seller" })
      .select("name avatar rating totalSales followers")
      .sort({ totalSales: -1, rating: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      artisans
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const followArtisan = async (req, res) => {
  try {
    const userId = req.user.id;
    const artisanId = req.params.id;

    if (userId === artisanId) {
      return res.status(400).json({ success: false, message: "Cannot follow yourself" });
    }

    const artisan = await User.findById(artisanId);

    if (!artisan || artisan.role !== "seller") {
      return res.status(404).json({ success: false, message: "Artisan not found" });
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { following: artisanId },
    });

    await User.findByIdAndUpdate(artisanId, {
      $addToSet: { followers: userId },
    });

    return res.json({ success: true });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const unfollowArtisan = async (req, res) => {
  try {
    const userId = req.user.id;
    const artisanId = req.params.id;

    await User.findByIdAndUpdate(userId, {
      $pull: { following: artisanId },
    });

    await User.findByIdAndUpdate(artisanId, {
      $pull: { followers: userId },
    });

    return res.json({ success: true });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};