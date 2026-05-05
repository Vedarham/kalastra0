import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true,
        maxlength: 120,
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        enum: [
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
            ],
        index: true
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        publicId: String,
    }],
  
    artisan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
  
    quantity: {
        type: Number,
        required: [true, 'Please provide quantity'],
        min: 0,
        default: 1
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 1
    },
    sales: {
        type: Number,
        default: 0
    },
    dimensions:{
        length: Number,
        width: Number,
        height: Number,
        unit: {
        type: String,
        enum: ['cm', 'in'],
        default: 'cm'
        }
    },
    weight: {
        value: Number,
        unit: {
        type: String,
        enum: ['g', 'kg', 'oz', 'lb'],
        default: 'kg'
        }
    },
    seoTags: [String],  // e.g., ['handmade', 'pottery']
    reachChance: { type: Number },  // e.g., 23 for "23% more reach"
    recommendedPrice: { type: Number },
    status: {
        type: String,
        enum: ['draft', 'active', 'sold_out', 'discontinued'],
        default: 'active'
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isActive: {
      type: Boolean,
      default: true,
    },
},{timestamps: true})

export default mongoose.model('Product', productSchema)

