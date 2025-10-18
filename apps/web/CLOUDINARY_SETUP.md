# Cloudinary Setup

This project is configured to use Cloudinary for image and media management.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
CLOUDINARY_CLOUD_NAME=du0xtdehy
CLOUDINARY_API_KEY=158581243397933
CLOUDINARY_API_SECRET=9hQYNaXuqKten8ZNZewP3Ylge6A
CLOUDINARY_URL=cloudinary://158581243397933:9hQYNaXuqKten8ZNZewP3Ylge6A@du0xtdehy
```

## Usage

### 1. Using the ImageUpload Component

```tsx
import { ImageUpload } from '@/components/image-upload';

function MyComponent() {
  const handleUploadSuccess = (result: any) => {
    console.log('Upload successful:', result);
    // result.public_id - Cloudinary public ID
    // result.secure_url - Direct URL to the uploaded image
  };

  const handleUploadError = (error: string) => {
    console.error('Upload failed:', error);
  };

  return (
    <ImageUpload
      onUploadSuccess={handleUploadSuccess}
      onUploadError={handleUploadError}
      maxSize={5} // 5MB limit
    />
  );
}
```

### 2. Using the useCloudinary Hook

```tsx
import { useCloudinary } from '@/hooks/use-cloudinary';

function MyComponent() {
  const { uploadFile, deleteFile, getImageUrl, isUploading, error } = useCloudinary();

  const handleFileUpload = async (file: File) => {
    const result = await uploadFile(file, {
      folder: 'my-app',
      transformation: {
        width: 400,
        height: 300,
        crop: 'fill'
      }
    });
    
    if (result) {
      console.log('Uploaded:', result.secure_url);
    }
  };

  return (
    <div>
      {isUploading && <p>Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {/* Your upload UI */}
    </div>
  );
}
```

### 3. Server-side Upload (API Route)

```tsx
// Using the API route
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
```

## Available Functions

### Client-side (lib/cloudinary.ts)
- `uploadImage(file, options)` - Upload an image
- `deleteImage(publicId)` - Delete an image
- `getImageUrl(publicId, transformations)` - Get optimized image URL
- `generateImageUrl(publicId, options)` - Generate URL with transformations

### React Hook (hooks/use-cloudinary.ts)
- `uploadFile(file, options)` - Upload with loading states
- `deleteFile(publicId)` - Delete with error handling
- `getImageUrl(publicId, options)` - Get transformed URL
- `isUploading` - Upload loading state
- `error` - Error message

## Image Transformations

Cloudinary supports various transformations:

```tsx
const imageUrl = getImageUrl('public_id', {
  width: 400,
  height: 300,
  crop: 'fill',
  quality: 'auto',
  format: 'webp'
});
```

## Security Notes

- Never expose your API secret in client-side code
- Use signed uploads for sensitive content
- Set up upload presets in Cloudinary dashboard for better security
- Consider implementing file type and size validation

## Next Steps

1. Add the environment variables to your `.env.local` file
2. Install dependencies: `pnpm install`
3. Start using the ImageUpload component or useCloudinary hook
4. Customize transformations as needed for your use case
