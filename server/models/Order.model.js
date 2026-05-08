import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },

  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: String,    
    image: String,  
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'confirmed', 'cancelled', 'refunded'],
      default: 'pending'
    }
  }],

  shippingAddress: {
    fullName: String,
    addressLine1: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String
  },

  pricing: {
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },

  payment: {
    method: {
      type: String,
      enum: ['card', 'stripe', 'razorpay'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    amount: Number,
    currency:{
      type: String,
      enum: ['INR', 'USD'],
      default: 'INR'
    },
    paidAt: Date
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'cancelled', 'refunded'],
    default: 'pending',
    index: true
  },

  isPaid: { type: Boolean, default: false },

  notes: { buyer: String, seller: String },

  cancelledBy: { type: String, enum: ['buyer', 'seller', 'admin'] },
  cancelReason: String,
  cancelledAt: Date

}, { timestamps: true });

orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }
  next();
});

export default mongoose.model("Order", orderSchema);