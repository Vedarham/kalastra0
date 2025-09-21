import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        require: true
    },
    quantity: { 
        type: Number, 
        default: 1 
    },
    imageUrl: { type: String },
    seoTags: [String],  // e.g., ['handmade', 'pottery']
    reachChance: { type: Number },  // e.g., 23 for "23% more reach"
    recommendedPrice: { type: Number },
    type: { type: String, enum: ['portfolio', 'sell'], required: true },
    artisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{timestamps: true})

export default mongoose.model('Product', productSchema)

