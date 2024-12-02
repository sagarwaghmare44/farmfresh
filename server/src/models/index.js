import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'farmer', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

// Product Schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['vegetables', 'fruits']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required']
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', productSchema); 