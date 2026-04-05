    import mongoose from 'mongoose';

    const notificationSchema = new mongoose.Schema({

        recipient:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true   
        },
        sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        },
        type: {
        type: String,
        enum: [
        'order_placed',
        'order_updated',
        'order_shipped',
        'order_delivered',
        'order_cancelled',
        'payment_received',
        'new_message',
        'new_review',
        'product_sold',
        'low_stock',
        'promotion',
        'system'
        ],
        required: true
    },
    
    title: {
        type: String,
        required: true,
        trim: true
    },
    
    message: {
        type: String,
        required: true,
        trim: true
    },
    
    link: {
        type: String
    },
    isRead: {
    type: Boolean,
    default: false
    },
    readAt: Date,
    priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
    } 
},{
    timestamps:true
});

export default mongoose.model('Notification', notificationSchema);