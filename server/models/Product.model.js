import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description'],
        maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: [0, 'Price cannot be negative']
    },
    quantity: { 
        type: Number, 
        default: 1 
    },
    category: {
    type: String,
    required: [true, 'Please select a category'],
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
        ]
    },
    subcategory: String,
  
    images: [{
        url: {
        type: String,
        required: true
        },
        publicId: String,
        alt: String
    }],
  
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
  
    inventory: {
        quantity: {
        type: Number,
        required: [true, 'Please provide quantity'],
        min: [0, 'Quantity cannot be negative'],
        default: 0
        },
        sku: {
        type: String,
        unique: true,
        sparse: true
        },
        trackInventory: {
        type: Boolean,
        default: true
        },
        lowStockThreshold: {
        type: Number,
        default: 5
        }
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
    imageUrl: { type: String },
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
},{timestamps: true})

export default mongoose.model('Product', productSchema)

