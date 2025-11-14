# Profile Management Setup

This document describes the new profile management system with avatar functionality and Cloudinary integration.

## 🎯 Features Implemented

### 1. Database Schema Updates
- **Split Name Fields**: `fullName` → `firstName` + `lastName`
- **Profile Image**: Added `profileImage` field for Cloudinary URLs
- **Enhanced User Management**: New `updateUserProfile` mutation

### 2. Avatar Icon in Navbar
- **Smart Display**: Shows profile image or default user icon
- **Wallet Integration**: Automatically detects connected wallet
- **Click to Edit**: Opens profile bottom sheet on click

### 3. Reusable Profile Bottom Sheet
- **Complete Profile Form**: First name, last name, email, phone, skill level
- **Image Upload**: Integrated Cloudinary upload with preview
- **Real-time Updates**: Form updates immediately reflect changes
- **Validation**: Proper form validation and error handling

### 4. Cloudinary Integration
- **Image Upload**: Direct upload to Cloudinary with transformations
- **Optimization**: Automatic image optimization and format conversion
- **Security**: Secure upload with proper error handling

## 🚀 Usage Examples

### Basic Avatar Usage (Navbar)
```tsx
// Already implemented in navbar.tsx
<AvatarIcon walletAddress={address} />
```

### Using the Profile Hook
```tsx
import { useUserProfile } from '@/hooks/use-user-profile';

function MyComponent() {
  const { user, isProfileOpen, openProfile, closeProfile } = useUserProfile(address);
  
  return (
    <div>
      <button onClick={openProfile}>Edit Profile</button>
      <ProfileBottomSheet
        isOpen={isProfileOpen}
        onClose={closeProfile}
        userId={user?._id}
        user={user}
      />
    </div>
  );
}
```

### Direct Component Usage
```tsx
import { ProfileBottomSheet } from '@/components/profile-bottom-sheet';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Profile</button>
      <ProfileBottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userId={userId}
        user={userData}
      />
    </div>
  );
}
```

## 📁 Files Created/Modified

### New Files
- `src/components/profile-bottom-sheet.tsx` - Reusable profile management component
- `src/components/avatar-icon.tsx` - Avatar icon for navbar
- `src/hooks/use-user-profile.ts` - Profile management hook
- `src/components/profile-usage-example.tsx` - Usage examples

### Modified Files
- `convex/schema.ts` - Updated user schema
- `convex/users.ts` - Added profile update mutations
- `src/components/navbar.tsx` - Added avatar icon

## 🔧 Environment Setup

Make sure you have the Cloudinary environment variables set:

```env
CLOUDINARY_CLOUD_NAME=du0xtdehy
CLOUDINARY_API_KEY=158581243397933
CLOUDINARY_API_SECRET=9hQYNaXuqKten8ZNZewP3Ylge6A
CLOUDINARY_URL=cloudinary://158581243397933:9hQYNaXuqKten8ZNZewP3Ylge6A@du0xtdehy
```

## 🎨 UI Components

### Avatar Icon
- **Size**: 32x32px (w-8 h-8)
- **Style**: Rounded full with hover effects
- **Fallback**: User icon when no profile image
- **Integration**: Automatically shows in navbar when wallet connected

### Profile Bottom Sheet
- **Form Fields**: First name, last name, email, phone, skill level
- **Image Upload**: Drag & drop or click to upload
- **Validation**: Real-time form validation
- **Responsive**: Mobile-optimized design
- **Theme**: Matches app's dark theme with gold accents

## 🔄 Data Flow

1. **User connects wallet** → Avatar appears in navbar
2. **User clicks avatar** → Profile bottom sheet opens
3. **User uploads image** → Image uploads to Cloudinary
4. **User fills form** → Data validates in real-time
5. **User saves** → Profile updates in database
6. **Avatar updates** → Shows new profile image

## 🛠️ Customization

### Adding New Profile Fields
1. Update `convex/schema.ts` with new field
2. Add field to `updateUserProfile` mutation
3. Add form input to `ProfileBottomSheet`
4. Update form state management

### Styling Customization
- **Colors**: Modify Tailwind classes in components
- **Layout**: Adjust spacing and sizing in component files
- **Theme**: Update color scheme in component styles

## 🚨 Important Notes

- **Cloudinary Required**: Profile image upload requires Cloudinary setup
- **Wallet Connection**: Avatar only shows when wallet is connected
- **Data Validation**: All form fields have proper validation
- **Error Handling**: Comprehensive error handling for uploads and updates
- **Mobile Responsive**: All components are mobile-optimized

## 🔍 Testing

To test the profile functionality:

1. **Connect Wallet**: Ensure wallet is connected
2. **Click Avatar**: Should open profile bottom sheet
3. **Upload Image**: Test image upload functionality
4. **Fill Form**: Complete all profile fields
5. **Save Changes**: Verify data persists
6. **Check Avatar**: Confirm new image appears

The profile system is now fully integrated and ready for use throughout the application!
