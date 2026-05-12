import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import cloudinary from "../config/cloudinary.js";

export const deleteProfile = async(req,res)=>{
    try {
        const userId = req.user.id;
        if(req.user.role === "seller"){
          await Product.updateMany({ artisan: req.user.id }, { isActive: false });
        }
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

export const becomeArtisan = async(req,res)=>{
  try {
    const user = await User.findById(req.user.id);
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    if(user.isSellerVerified  === 'true'){
      return res.status(400).json({
        success: false,
        message: "Already an artisan"
      });
    }
      user.role = "seller";
      user.isSellerVerified = "false"; 
      user.shopName = `${user.name}'s Shop`;
      await user.save();
      
    return res.status(200).json({
      success:true,
      message: "Artisan mode active. Awaiting verification.",
      user
    });

  } catch (error) {
     return res.status(500).json({
      success:false,
      message: "Error switching role",
      error: error.message
    })
  }
};

export const updateProfile =async(req,res)=>{
  try {
    const {name, email, phone, avatar, bio, location, preferences, privacy} = req.body;

    const user = await User.findById(req.user.id);
    if(!user){
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase().trim();
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;

    if (location) {
      user.location = {
        city: location.city || user.location?.city,
        state: location.state || user.location?.state,
        country: location.country || user.location?.country,
      };
    }
    
    if (preferences) {
      user.preferences = {
        language: preferences.language || user.preferences?.language,
        currency: preferences.currency || user.preferences?.currency,
        theme: preferences.theme || user.preferences?.theme,
      }
    }

    if (privacy) {
      user.privacy = {
        profileVisible: privacy.profileVisible !== undefined ? privacy.profileVisible : user.privacy?.profileVisible,
        showEmail: privacy.showEmail !== undefined ? privacy.showEmail : user.privacy?.showEmail,
        allowMessages: privacy.allowMessages !== undefined ? privacy.allowMessages : user.privacy?.allowMessages,
      }
    }

    await user.save();
      
    return res.status(200).json({
      success:true,
      message: "Profile updated successfully.",
      user
    });
  } catch (error) {
     return res.status(500).json({
      success:false,
      message: "Error updating profile",
      error: error.message
    })
  }
};

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
    });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Prevent seller from wishlisting their own product
    const product = await Product.findById(productId);
    if (product && product.artisan.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot wishlist your own product" });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const index = user.wishlist.indexOf(productId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    return res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "wishlist",
      populate: {
        path: "artisan",
        select: "name shopName"
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const exportData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("wishlist")
      .select("-password -refreshTokens");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=kalastra_data_${user.name.replace(/\s+/g, '_')}.json`);
    
    return res.status(200).send(JSON.stringify(user, null, 2));
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};