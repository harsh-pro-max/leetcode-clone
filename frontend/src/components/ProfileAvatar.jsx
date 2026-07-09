import { useRef } from 'react';

function ProfileAvatar({ imageUrl, firstName, lastName, isEditing, onImageUpload, isUploading }) {
  const fileInputRef = useRef(null);

  // ✅ Initials logic yahin rakha hai (Helpers nahi banaya)
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';

  const handleFileChange = (e) => {
    if (e.target.files[0]) onImageUpload(e.target.files[0]);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="avatar">
        <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
          {imageUrl ? (
            <img src={imageUrl} alt="Profile" className="object-cover w-full h-full" />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-primary text-primary-content text-3xl font-bold">
              {initials}
            </div>
          )}
        </div>
      </div>
      {isEditing && (
        <div className="mt-3">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="file-input file-input-bordered file-input-sm max-w-xs"
            disabled={isUploading}
          />
          {isUploading && <span className="ml-2 loading loading-spinner loading-sm"></span>}
          <p className="text-xs text-base-content/50 mt-1">Max 2MB (JPG, PNG, WebP)</p>
        </div>
      )}
    </div>
  );
}

export default ProfileAvatar;