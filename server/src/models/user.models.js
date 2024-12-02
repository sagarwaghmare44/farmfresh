import mongoose from "mongoose";

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
    },
    address: {
        type: String,
        required: function() { return this.role === 'farmer'; }
    },
    phone: {
        type: String,
        required: function() { return this.role === 'farmer'; }
    },
    documentUrl: {
        type: String,
        required: function() { return this.role === 'farmer'; }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: function() {
            return this.role === 'farmer' ? 'pending' : 'approved';
        }
    },
    isVerified: {
        type: Boolean,
        default: function() {
            return this.role !== 'farmer';
        }
    }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
