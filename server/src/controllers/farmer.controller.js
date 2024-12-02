// farmer.controller.js
import { User } from "../models/user.models.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cloudinary, uploadOnCloudinary } from '../utils/cloudinary.js';
import fs from 'fs';

export const registerFarmer = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Handle document upload
        let documentUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'farmer_documents'
            });
            documentUrl = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create farmer with initial pending status
        const farmer = new User({
            name,
            email,
            password: hashedPassword,
            role: 'farmer',
            address,
            phone,
            documentUrl,
            status: 'pending',
            isVerified: false
        });

        await farmer.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful. Please wait for admin approval.',
            farmer: {
                _id: farmer._id,
                name: farmer.name,
                email: farmer.email,
                role: farmer.role,
                status: farmer.status
            }
        });

    } catch (error) {
        console.error('Farmer registration error:', error);
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

export const verifyFarmer = async (req, res) => {
    try {
        const farmer = await User.findByIdAndUpdate(
            req.params.id,
            { isVerified: true },
            { new: true }
        ).select('-password');

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: 'Farmer not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Farmer verified successfully',
            farmer
        });
    } catch (error) {
        console.error('Farmer verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying farmer'
        });
    }
};
