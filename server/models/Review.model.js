import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5
    },
    title: {
        type: String,
        trim: true,
        maxlength: [100, 'Review title cannot be more than 100 characters']
    },
    comment: {
        type: String,
        required: [true, 'Please provide a review comment'],
        maxlength: [1000, 'Review comment cannot be more than 1000 characters']
    },
    images: [{
        url: String,
        publicId: String
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    response: {
        comment: String,
        createdAt: Date
    },

    helpful: {
        type: Number,
        default: 0
    },

    helpfulVotes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        vote: {
            type: Number,
            enum: [1, -1]
        }
    }],

    isApproved: {
        type: Boolean,
        default: true
    },

    isHidden: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Review', reviewSchema);