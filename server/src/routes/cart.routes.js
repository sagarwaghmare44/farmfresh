import express from 'express';
import { verifyJWT } from '../middleware/auth.js';
import {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from '../controllers/cart.controllers.js';

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Cart routes
router.post('/add', addToCart);
router.get('/', getCart);
router.put('/update/:productId', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

export default router; 