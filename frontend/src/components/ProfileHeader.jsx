function ProfileHeader({ isEditing, onToggle }) {
  return (
    <div className="flex justify-between items-center border-b pb-4">
      <h2 className="card-title text-3xl">My Profile</h2>
      <button onClick={onToggle} className="btn btn-outline btn-sm">
        {isEditing ? "Cancel" : "Edit Profile"}
      </button>
    </div>
  );
}

export default ProfileHeader;