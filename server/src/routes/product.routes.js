import express from 'express';
import { verifyJWT } from '../middleware/auth.js';
import { 
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getApprovedProducts,
    getPendingProducts,
    updateProductStatus
} from '../controllers/product.controllers.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/approved', getApprovedProducts);
router.get('/all', getAllProducts);

// Protected routes (require authentication)
router.use(verifyJWT);

// Farmer routes
router.post('/add', upload.single('image'), addProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

// Admin routes
router.get('/pending', getPendingProducts);
router.put('/:productId/status', updateProductStatus);

// Common protected routes
router.get('/:id', getProductById);

export default router;
