import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: 'ddneuyab6',
    api_key: '568255734287227',
    api_secret: '5krLHoJ2oq4hZ4c_v5qsQRzUci0'
});

export default cloudinary; 