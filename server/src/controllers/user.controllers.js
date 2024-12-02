import { User } from "../models/user.models.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cloudinary, uploadOnCloudinary } from '../utils/cloudinary.js';

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'user'
        });

        await user.save();

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user type matches
        if (user.role !== userType) {
            return res.status(401).json({
                success: false,
                message: 'Invalid user type'
            });
        }

        // For all users (including admin), use bcrypt comparison
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check farmer verification status
        if (user.role === 'farmer' && user.status !== 'approved') {
            return res.status(401).json({
                success: false,
                message: 'Your account is pending approval from admin'
            });
        }

        // Generate token
        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

// Get All Users for Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        
        // Format users according to your MongoDB structure
        const formattedUsers = users.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            userType: user.userType || user.role,
            status: user.status || 'pending',
            isVerified: user.isVerified || false,
            contact: user.contact || user.phone,
            address: user.address,
            document: user.document || user.documentUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));

        // Filter users and farmers
        const regularUsers = formattedUsers.filter(user => 
            (user.userType === 'user' || user.role === 'user') && 
            user.email !== 'admin@gmail.com'
        );
        const farmers = formattedUsers.filter(user => 
            user.userType === 'farmer' || user.role === 'farmer'
        );

        res.status(200).json({
            success: true,
            data: {
                users: regularUsers,
                farmers: farmers
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user'
        });
    }
};

// Verify Farmer
export const verifyFarmer = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isVerified: true },
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: 'Farmer verified successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error verifying farmer'
        });
    }
};

// Get User By ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user'
        });
    }
};

// Update User
export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating user'
        });
    }
};

// Update Avatar
export const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image provided'
            });
        }

        const result = await uploadOnCloudinary(req.file.path);
        if (!result) {
            return res.status(500).json({
                success: false,
                message: 'Error uploading image'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { avatar: result.secure_url },
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Avatar updated successfully',
            avatarUrl: result.secure_url
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating avatar'
        });
    }
};

// Get User Avatar
export const getUserAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('avatar');
        if (!user || !user.avatar) {
            return res.status(404).json({
                success: false,
                message: 'Avatar not found'
            });
        }
        res.status(200).json({
            success: true,
            avatar: user.avatar
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching avatar'
        });
    }
};

// Update Farmer Status
export const updateFarmerStatus = async (req, res) => {
    try {
        const { farmerId } = req.params;
        const { status } = req.body;

        console.log('Updating farmer status:', { farmerId, status });

        // Find and update the farmer
        const updatedFarmer = await User.findByIdAndUpdate(
            farmerId,
            {
                $set: {
                    status: status,
                    isVerified: status === 'approved'
                }
            },
            { new: true }
        );

        if (!updatedFarmer) {
            return res.status(404).json({
                success: false,
                message: 'Farmer not found'
            });
        }

        console.log('Updated farmer:', updatedFarmer);

        res.status(200).json({
            success: true,
            message: 'Farmer status updated successfully',
            farmer: {
                _id: updatedFarmer._id,
                name: updatedFarmer.name,
                email: updatedFarmer.email,
                status: updatedFarmer.status,
                isVerified: updatedFarmer.isVerified
            }
        });

    } catch (error) {
        console.error('Error updating farmer status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating farmer status',
            error: error.message
        });
    }
};

// View Farmer Document
export const getFarmerDocument = async (req, res) => {
    try {
        const { farmerId } = req.params;
        const farmer = await User.findById(farmerId).select('document documentUrl');

        if (!farmer || (!farmer.document && !farmer.documentUrl)) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        res.status(200).json({
            success: true,
            documentUrl: farmer.document || farmer.documentUrl
        });
    } catch (error) {
        console.error('Error fetching farmer document:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching document',
            error: error.message
        });
    }
};

// Register Admin
export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password for admin too
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin user
        const user = new User({
            name,
            email,
            password: hashedPassword, // Store hashed password
            role: 'admin',
            status: 'approved',
            isVerified: true
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully'
        });

    } catch (error) {
        console.error('Admin registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};
