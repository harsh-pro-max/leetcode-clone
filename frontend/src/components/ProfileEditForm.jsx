function ProfileEditForm({ formData, onChange, onSubmit, loading, email }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="form-control">
        <label className="label"><span className="label-text">First Name</span></label>
        <input
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={onChange}
          className="input input-bordered"
          required
        />
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Last Name</span></label>
        <input
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={onChange}
          className="input input-bordered"
        />
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Email (Read-only)</span></label>
        <input type="email" value={email} className="input input-bordered input-disabled" disabled />
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Age</span></label>
        <input
          name="age"
          type="number"
          value={formData.age}
          onChange={onChange}
          className="input input-bordered"
        />
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Phone Number</span></label>
        <input
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={onChange}
          className="input input-bordered"
          placeholder="10-15 digits"
        />
      </div>
      <button
        type="submit"
        className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

export default ProfileEditForm;