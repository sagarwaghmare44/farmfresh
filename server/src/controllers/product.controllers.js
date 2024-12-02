import { Product } from "../models/product.model.js";
import { cloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import fs from 'fs';

// Add Product
export const addProduct = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            category, 
            marketPrice, 
            ourPrice,
            stock,
            unit 
        } = req.body;
        
        const farmerId = req.user._id;

        // Validate required fields
        if (!name || !description || !category || !marketPrice || !ourPrice) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Handle image upload
        let imageUrl = '';
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'products'
                });
                imageUrl = result.secure_url;
                // Clean up the uploaded file
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error uploading image'
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Product image is required'
            });
        }

        // Create product
        const product = new Product({
            name,
            description,
            category,
            imageUrl,
            marketPrice: Number(marketPrice),
            ourPrice: Number(ourPrice),
            stock: Number(stock),
            unit,
            farmer: farmerId,
            status: 'pending'
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product added successfully and pending approval',
            product
        });

    } catch (error) {
        console.error('Error adding product:', error);
        // Clean up uploaded file if exists
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            success: false,
            message: 'Failed to add product',
            error: error.message
        });
    }
};

// Get Product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('farmer', 'name email');
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// Get All Products (Admin)
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('farmer', 'name email');
        
        res.json({
            success: true,
            products: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// Get Approved Products (Public)
export const getApprovedProducts = async (req, res) => {
    try {
        const products = await Product.find({ 
            status: 'approved'  // Only get products with approved status
        }).populate('farmer', 'name email');
        
        res.json({
            success: true,
            products: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching approved products',
            error: error.message
        });
    }
};

// Get Pending Products (Admin)
export const getPendingProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: 'pending' })
            .populate('farmer', 'name email');
        
        res.json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching pending products',
            error: error.message
        });
    }
};

// Update Product Status (Admin)
export const updateProductStatus = async (req, res) => {
    try {
        const { productId } = req.params;
        const { status } = req.body;

        const product = await Product.findByIdAndUpdate(
            productId,
            { status },
            { new: true }
        ).populate('farmer', 'name email');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: `Product ${status} successfully`,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating product status',
            error: error.message
        });
    }
};

// Update Product (Farmer)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if the user is the owner of the product
        if (product.farmer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this product'
            });
        }

        // Handle image update if new image is provided
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'products'
            });
            updates.imageUrl = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        ).populate('farmer', 'name email');

        res.json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// Delete Product (Farmer)
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if the user is the owner of the product
        if (product.farmer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this product'
            });
        }

        await Product.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
}; 