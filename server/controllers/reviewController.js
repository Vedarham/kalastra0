import Review from "../models/Review.model.js";
import Order from "../models/Order.model.js"

export const getProductReviews = async(req,res)=>{
   try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true,
      isHidden: false
    }).populate('user', 'name avatar').sort(-1);

    const total = await Review.countDocuments({
      product: req.params.productId,
      isApproved: true,
      isHidden: false
    });
    res.json({ success: true, data: reviews, total});
   }catch(error){
    res.status(500).json({
        success:false,
        message: 'Error fetching reviews',
        error: error.message
    });
   }
}

export const createReview = async(req,res)=>{

    try {
        const {product,rating,title,comment,images,orderId} = req.body;
        if(orderId){
            const order = await Order.findOne({
                _id:orderId,
                buyer:req.user.id,
                'items.product':product,
                status:'delivered'
            });

            if(order) req.body.order = orderId;
        }

        const existingReview = await Review.findOne({product,user: req.user.id});
        if(existingReview){
        return res.status(400).json({
            success: false,
            message: 'You have already reviewed this product'
        });
        }

        const review = await Review.create({
        product,
        user: req.user.id,
        rating,
        title,
        comment,
        images,
        ...req.body
        });

        await review.populate('user', 'name avatar');

        res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: review
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: 'Error creating review',
            error: error.message
        });
    }

};

export const updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);
    if(!review){
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if(review.user.toString() !== req.user.id){
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        rating: req.body.rating,
        title: req.body.title,
        comment: req.body.comment,
        images: req.body.images
      },
      { new: true, runValidators: true }
    ).populate('user', 'name avatar');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if(!review){
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }
    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

// Voting TBD