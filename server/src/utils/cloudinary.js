import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Configure cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Upload function
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        // Upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        // File has been uploaded successfully
        fs.unlinkSync(localFilePath); // Remove the locally saved temp file
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove the locally saved temp file as the upload operation failed
        return null;
    }
};

export { cloudinary, uploadOnCloudinary }; 