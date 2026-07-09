import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';

function DeleteProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirm = window.confirm(
      '⚠️ Are you sure you want to delete your account?\n\n' +
      'This action is PERMANENT and cannot be undone.\n' +
      'All your submissions, solved problems, and data will be lost.'
    );

    if (!confirm) return;

    setLoading(true);
    try {
      await axiosClient.delete('/user/deleteProfile');
      alert('Your account has been deleted successfully.');
      dispatch(logoutUser());
      navigate('/');
    } catch (err) {
      alert('Failed to delete account: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t-2 border-error/30">
      <h3 className="text-lg font-bold text-error mb-2">⚠️ Danger Zone</h3>
      <p className="text-sm text-base-content/70 mb-4">
        Permanently delete your account and all associated data. This action cannot be undone.
      </p>
      <button
        onClick={handleDelete}
        className={`btn btn-error ${loading ? 'loading' : ''}`}
        disabled={loading}
      >
        {loading ? 'Deleting...' : 'Delete Account'}
      </button>
    </div>
  );
}

export default DeleteProfile;