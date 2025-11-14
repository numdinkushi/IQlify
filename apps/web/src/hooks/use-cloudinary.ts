import { useState, useCallback } from 'react';
import { uploadImage, deleteImage, generateImageUrl } from '@/lib/cloudinary';

interface UploadResult {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
}

interface UseCloudinaryReturn {
    uploadFile: (file: File, options?: any) => Promise<UploadResult | null>;
    deleteFile: (publicId: string) => Promise<boolean>;
    getImageUrl: (publicId: string, options?: any) => string;
    isUploading: boolean;
    error: string | null;
}

export const useCloudinary = (): UseCloudinaryReturn => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = useCallback(async (file: File, options?: any): Promise<UploadResult | null> => {
        setIsUploading(true);
        setError(null);

        try {
            const result = await uploadImage(file, options);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Upload failed';
            setError(errorMessage);
            console.error('Cloudinary upload error:', err);
            return null;
        } finally {
            setIsUploading(false);
        }
    }, []);

    const deleteFile = useCallback(async (publicId: string): Promise<boolean> => {
        try {
            await deleteImage(publicId);
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Delete failed';
            setError(errorMessage);
            console.error('Cloudinary delete error:', err);
            return false;
        }
    }, []);

    const getImageUrl = useCallback((publicId: string, options?: any): string => {
        return generateImageUrl(publicId, options);
    }, []);

    return {
        uploadFile,
        deleteFile,
        getImageUrl,
        isUploading,
        error,
    };
};
