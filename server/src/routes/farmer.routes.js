import { Router } from 'express';
import { upload } from '../middleware/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { 
    registerFarmer,
    loginFarmer,
    getFarmerProfile,
    updateFarmerProfile,
    deleteFarmerProfile
} from '../controllers/farmer.controller.js';

const router = Router();

// Public routes
router.route("/register").post(
    upload.single("document"),
    registerFarmer
);
router.route("/login").post(loginFarmer);

// Protected routes
router.route("/profile")
    .get(verifyJWT, getFarmerProfile)
    .put(verifyJWT, upload.single("document"), updateFarmerProfile)
    .delete(verifyJWT, deleteFarmerProfile);

export default router; 