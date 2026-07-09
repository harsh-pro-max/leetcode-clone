function ProfileInfoDisplay({ user }) {
  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-base-200 p-3 rounded-lg">
          <label className="label-text font-bold block text-sm">First Name</label>
          <p className="text-lg">{user.firstName}</p>
        </div>
        <div className="bg-base-200 p-3 rounded-lg">
          <label className="label-text font-bold block text-sm">Last Name</label>
          <p className="text-lg">{user.lastName || 'N/A'}</p>
        </div>
        <div className="bg-base-200 p-3 rounded-lg col-span-2">
          <label className="label-text font-bold block text-sm">Email Address</label>
          <p className="text-lg">{user.emailId}</p>
        </div>
        <div className="bg-base-200 p-3 rounded-lg">
          <label className="label-text font-bold block text-sm">Age</label>
          <p className="text-lg">{user.age || 'N/A'}</p>
        </div>
        <div className="bg-base-200 p-3 rounded-lg">
          <label className="label-text font-bold block text-sm">Phone Number</label>
          <p className="text-lg">{user.phoneNumber || 'N/A'}</p>
        </div>
        <div className="bg-base-200 p-3 rounded-lg">
          <label className="label-text font-bold block text-sm">Role</label>
          <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-ghost'} text-lg p-3`}>
            {user.role.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 pt-4 border-t border-base-300">
        <div>
          <span className="font-bold">Problems Solved:</span>
          <span className="ml-2 text-xl font-bold text-success">{user.problemSolved?.length || 0}</span>
        </div>
        <div>
          <span className="font-bold">Member Since:</span>
          <span className="ml-2">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfoDisplay;