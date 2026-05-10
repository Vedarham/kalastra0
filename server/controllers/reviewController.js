import Review from "../models/Review.model.js";
import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";

const recalcProductStats = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId, isApproved: true, isHidden: false } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].count,
    });
  } else {
    await Product.findByIdAndUpdate(productId, { rating: 0, numReviews: 0 });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true,
      isHidden: false,
    })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({
      product: req.params.productId,
      isApproved: true,
      isHidden: false,
    });

    res.json({ success: true, data: reviews, total });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

export const createReview = async (req, res) => {
  try {
    const { product, rating, title, comment, images, orderId } = req.body;

    if (!product || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "product, rating and comment are required",
      });
    }
    let orderRef = undefined;
    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        buyer: req.user.id,
        "items.product": product,
        status: "delivered",
      });
      if (order) orderRef = orderId;
    }

    const existingReview = await Review.findOne({
      product,
      user: req.user.id,
    });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const review = await Review.create({
      product,
      user: req.user.id,
      rating,
      title,
      comment,
      images: images || [],
      order: orderRef,
    });

    await review.populate("user", "name avatar");
    await recalcProductStats(review.product);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating review",
      error: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review",
      });
    }

    const { rating, title, comment, images } = req.body;

    review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, title, comment, images },
      { new: true, runValidators: true }
    ).populate("user", "name avatar");

    await recalcProductStats(review.product);

    res.json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (
      review.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    const productId = review.product;
    await review.deleteOne();
    await recalcProductStats(productId);

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
};