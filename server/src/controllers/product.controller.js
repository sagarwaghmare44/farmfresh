import { Product } from '../models/product.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const addProduct = async (req, res) => {
    try {
        const { name, category, description, ourPrice, marketPrice, rating } = req.body;

        if (!req.file) {
            throw new ApiError(400, "Product image is required");
        }

        // Upload image to cloudinary
        const imageUrl = await uploadOnCloudinary(req.file.path);
        if (!imageUrl) {
            throw new ApiError(500, "Error uploading image");
        }

        // Create product
        const product = await Product.create({
            name,
            category,
            description,
            imageUrl: imageUrl.url,
            ourPrice,
            marketPrice,
            rating,
            farmer: req.user._id // This comes from verifyJWT middleware
        });

        return res.status(201).json(
            new ApiResponse(201, product, "Product added successfully")
        );

    } catch (error) {
        console.error("Error in addProduct: ", error);
        throw new ApiError(500, error?.message || "Error adding product");
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('farmer', 'name email');
        
        return res.status(200).json(
            new ApiResponse(200, products, "Products fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Error fetching products");
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('farmer', 'name email');
        
        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        return res.status(200).json(
            new ApiResponse(200, product, "Product fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Error fetching product");
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        // Check if user is the farmer who created the product
        if (product.farmer.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Unauthorized to update this product");
        }

        // Handle image update if new image is provided
        let imageUrl = product.imageUrl;
        if (req.file) {
            const newImage = await uploadOnCloudinary(req.file.path);
            if (newImage) {
                imageUrl = newImage.url;
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                imageUrl
            },
            { new: true }
        );

        return res.status(200).json(
            new ApiResponse(200, updatedProduct, "Product updated successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Error updating product");
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        // Check if user is the farmer who created the product
        if (product.farmer.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Unauthorized to delete this product");
        }

        await Product.findByIdAndDelete(req.params.id);

        return res.status(200).json(
            new ApiResponse(200, {}, "Product deleted successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Error deleting product");
    }
};

// Get pending products
const getPendingProducts = async (req, res) => {
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

// Update product status
const updateProductStatus = async (req, res) => {
    try {
        const { productId } = req.params;
        const { status } = req.body;

        const product = await Product.findByIdAndUpdate(
            productId,
            { status },
            { new: true }
        );

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

export {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getPendingProducts,
    updateProductStatus
};
