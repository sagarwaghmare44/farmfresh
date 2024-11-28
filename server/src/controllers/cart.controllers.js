import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

// Add to Cart
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        // Check if product exists and is approved
        const product = await Product.findOne({ 
            _id: productId,
            status: 'approved'
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found or not approved"
            });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create new cart if doesn't exist
            cart = new Cart({
                user: userId,
                items: [{ product: productId, quantity: 1 }]
            });
        } else {
            // Check if product already exists in cart
            const existingItem = cart.items.find(
                item => item.product.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.items.push({ product: productId, quantity: 1 });
            }
        }

        await cart.save();

        // Populate product details
        const populatedCart = await Cart.findById(cart._id)
            .populate({
                path: 'items.product',
                select: 'name imageUrl ourPrice marketPrice category status'
            });

        res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart: populatedCart
        });

    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({
            success: false,
            message: "Error adding to cart",
            error: error.message
        });
    }
};

// Get Cart
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId })
            .populate({
                path: 'items.product',
                select: 'name imageUrl ourPrice marketPrice category status'
            });

        res.status(200).json({
            success: true,
            cart: cart || { items: [], totalAmount: 0 }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching cart",
            error: error.message
        });
    }
};

// Update Cart Item Quantity
export const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const userId = req.user._id;

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const cartItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        cartItem.quantity = quantity;
        await cart.save();

        const updatedCart = await Cart.findById(cart._id)
            .populate({
                path: 'items.product',
                select: 'name imageUrl ourPrice marketPrice category status'
            });

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart: updatedCart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating cart",
            error: error.message
        });
    }
};

// Remove from Cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();

        const updatedCart = await Cart.findById(cart._id)
            .populate({
                path: 'items.product',
                select: 'name imageUrl ourPrice marketPrice category status'
            });

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: updatedCart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error removing from cart",
            error: error.message
        });
    }
};

// Clear Cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;
        await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error clearing cart",
            error: error.message
        });
    }
}; 