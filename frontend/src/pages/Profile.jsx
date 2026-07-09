import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";
import { checkAuth } from "../authSlice";
import axios from "axios";

// ✅ Import Components
import ProfileHeader from "../components/ProfileHeader";
import ProfileAvatar from "../components/ProfileAvatar";
import ProfileInfoDisplay from "../components/ProfileInfoDisplay";
import ProfileEditForm from "../components/ProfileEditForm";
import DeleteProfile from "../components/DeleteProfile";

// ✅ Import Theme Context (with multiple themes)
import { useTheme } from "../context/ThemeContext";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { theme, changeTheme, THEMES } = useTheme(); // ✅ changeTheme + THEMES

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age || "",
    phoneNumber: user?.phoneNumber || "",
    profileImage: user?.profileImage || "",
  });

  if (!user) {
    navigate("/");
    return null;
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateProfile = async (data) => {
    try {
      await axiosClient.put("/user/update-profile", data);
      await dispatch(checkAuth());
      return true;
    } catch (err) {
      throw err;
    }
  };

  const handleImageUpload = async (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB.");
      return;
    }

    setImageUploading(true);
    try {
      const { data } = await axiosClient.get("/user/image-upload-signature");
      const { signature, timestamp, public_id, api_key, upload_url } = data;

      const formDataCloud = new FormData();
      formDataCloud.append("file", file);
      formDataCloud.append("signature", signature);
      formDataCloud.append("timestamp", timestamp);
      formDataCloud.append("public_id", public_id);
      formDataCloud.append("api_key", api_key);

      const uploadRes = await axios.post(upload_url, formDataCloud, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: false,
      });

      const imageUrl = uploadRes.data.secure_url;
      setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
      await updateProfile({ ...formData, profileImage: imageUrl });
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Failed to upload image.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">

          {/* ✅ Action Bar: Back to Home + Theme Dropdown (Always Visible) */}
          <div className="flex flex-wrap justify-between items-center gap-2 mb-2 border-b border-base-300 pb-2">
            <button
              onClick={() => navigate('/')}
              className="btn btn-ghost btn-sm gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>

            {/* ✅ Multiple Themes Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Theme:</span>
              <select
                value={theme}
                onChange={(e) => changeTheme(e.target.value)}
                className="select select-bordered select-sm"
              >
                {THEMES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 1. Header */}
          <ProfileHeader isEditing={isEditing} onToggle={() => setIsEditing(!isEditing)} />

          {/* 2. Avatar */}
          <ProfileAvatar
            imageUrl={formData.profileImage}
            firstName={user.firstName}
            lastName={user.lastName}
            isEditing={isEditing}
            onImageUpload={handleImageUpload}
            isUploading={imageUploading}
          />

          {/* 3. Display / Edit */}
          {!isEditing ? (
            <>
              <ProfileInfoDisplay user={user} />
              <DeleteProfile />
            </>
          ) : (
            <ProfileEditForm
              formData={formData}
              onChange={handleInputChange}
              onSubmit={handleUpdate}
              loading={loading}
              email={user.emailId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;