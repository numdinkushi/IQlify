'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/image-upload';

export const UploadTest = () => {
    const [uploadResult, setUploadResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleUploadSuccess = (result: any) => {
        console.log('Upload successful:', result);
        setUploadResult(result);
        setError(null);
    };

    const handleUploadError = (error: string) => {
        console.error('Upload error:', error);
        setError(error);
        setUploadResult(null);
    };

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-white font-bold">Upload Test</h3>

            <ImageUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                maxSize={2}
            />

            {uploadResult && (
                <div className="bg-green-800 p-4 rounded-lg">
                    <h4 className="text-green-400 font-bold mb-2">Upload Successful!</h4>
                    <p className="text-white text-sm">URL: {uploadResult.secure_url}</p>
                    <p className="text-white text-sm">Public ID: {uploadResult.public_id}</p>
                    {uploadResult.secure_url && (
                        <img
                            src={uploadResult.secure_url}
                            alt="Uploaded"
                            className="w-32 h-32 object-cover rounded-lg mt-2"
                        />
                    )}
                </div>
            )}

            {error && (
                <div className="bg-red-800 p-4 rounded-lg">
                    <h4 className="text-red-400 font-bold mb-2">Upload Failed</h4>
                    <p className="text-white text-sm">{error}</p>
                </div>
            )}
        </div>
    );
};
