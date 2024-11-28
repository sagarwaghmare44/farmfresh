import express from 'express';
import { verifyJWT } from '../middleware/auth.js';
import { 
    registerUser, 
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    updateAvatar,
    updateFarmerStatus,
    getFarmerDocument,
    registerAdmin
} from '../controllers/user.controllers.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin routes
router.get('/all', verifyJWT, getAllUsers);
router.put('/farmer-status/:farmerId', verifyJWT, updateFarmerStatus);
router.get('/farmer-document/:farmerId', verifyJWT, getFarmerDocument);

// User routes
router.get('/:id', verifyJWT, getUserById);
router.put('/:id', verifyJWT, updateUser);
router.post('/:id/avatar', verifyJWT, upload.single('avatar'), updateAvatar);

// Add this route with your other routes
router.post('/admin-register', registerAdmin);

export default router;
