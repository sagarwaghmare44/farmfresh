import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
];

export const verifyEnv = () => {
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        console.error('Missing required environment variables:', missingVars);
        process.exit(1);
    }
    
    console.log('All required environment variables are set');
}; 