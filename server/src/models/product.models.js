import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['vegetables', 'fruits', 'dairy', 'grains']
    },
    imageUrl: {
        type: String,
        required: true
    },
    marketPrice: {
        type: Number,
        required: true,
        min: 0
    },
    sellingPrice: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'gram', 'piece', 'dozen', 'liter']
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    isAvailable: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
