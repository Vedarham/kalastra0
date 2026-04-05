import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderNumber:{
      type: String,
      required: true,
      unique: true
    },
    
    buyer:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
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
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
        default: 'pending'
      },
      statusHistory: [{
        status: String,
        timestamp: {
          type: Date,
          default: Date.now
        },
        note: String
      }]
    }],
    
    shippingAddress: {
      fullName: {
        type: String,
        required: true
      },
      addressLine1: {
        type: String,
        required: true
      },
      addressLine2: String,
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      postalCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      }
    },

    pricing: {
      subtotal: {
        type: Number,
        required: true
      },
      shipping: {
        type: Number,
        default: 0
      },
      tax: {
        type: Number,
        default: 0
      },
      discount: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        required: true
      }
    },
    
    payment: {
      method: {
        type: String,
        enum: ['card', 'paypal', 'stripe', 'cash_on_delivery'],
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
      },
      transactionId: String,
      paidAt: Date,
      refundedAt: Date,
      refundAmount: Number
    },
    
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'partially_shipped', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending'
    },
    
    notes: {
      buyer: String,
      seller: String,
      admin: String
    },
    
    cancelledBy: {
      type: String,
      enum: ['buyer', 'seller', 'admin']
    },
    cancelReason: String,
    cancelledAt: Date,
    
    deliveredAt: Date,
    estimatedDelivery: Date,
    
    isPaid: {
      type: Boolean,
      default: false
    },

    isDelivered: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
