import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Utility functions for common Cloudinary operations
export const uploadImage = async (file: File | string, options?: any) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            resource_type: 'auto',
            ...options,
        });
        return result;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

export const deleteImage = async (publicId: string) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};

export const getImageUrl = (publicId: string, transformations?: any) => {
    return cloudinary.url(publicId, transformations);
};

export const generateImageUrl = (publicId: string, options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
}) => {
    return cloudinary.url(publicId, {
        width: options?.width,
        height: options?.height,
        crop: options?.crop || 'fill',
        quality: options?.quality || 'auto',
        format: options?.format || 'auto',
    });
};
