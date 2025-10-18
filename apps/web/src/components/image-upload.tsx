'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
    onUploadSuccess?: (result: any) => void;
    onUploadError?: (error: string) => void;
    className?: string;
    accept?: string;
    maxSize?: number; // in MB
}

export const ImageUpload = ({
    onUploadSuccess,
    onUploadError,
    className = '',
    accept = 'image/*',
    maxSize = 5
}: ImageUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Clear previous errors
        setError(null);

        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
            const errorMsg = `File size must be less than ${maxSize}MB`;
            setError(errorMsg);
            onUploadError?.(errorMsg);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file to API route
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();
            if (result.success && result.data) {
                setError(null);
                onUploadSuccess?.(result.data);
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            const errorMsg = error instanceof Error ? error.message : 'Upload failed';
            setError(errorMsg);
            onUploadError?.(errorMsg);
        } finally {
            setIsUploading(false);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
            />

            <Button
                onClick={handleClick}
                disabled={isUploading}
                className="w-full"
                variant="outline"
            >
                {isUploading ? 'Uploading...' : 'Choose Image'}
            </Button>

            {preview && (
                <div className="mt-4">
                    <img
                        src={preview}
                        alt="Preview"
                        className="max-w-full h-auto rounded-lg border"
                    />
                </div>
            )}

            {error && (
                <div className="text-red-500 text-sm">
                    {error}
                </div>
            )}
        </div>
    );
};
