import { useState, useEffect } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router';
import { useDispatch } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { checkAuth } from '../authSlice';

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const emailId = location.state?.emailId || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // ✅ Agar email nahi hai toh signup page par redirect
  useEffect(() => {
    if (!emailId) {
      navigate('/signup');
    }
  }, [emailId, navigate]);

  // ✅ Resend Timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axiosClient.post('/user/verify-otp', { emailId, otp });
      setSuccess(response.data.message);
      
      // ✅ OTP verify ho gaya, Redux state refresh karo (user logged in)
      await dispatch(checkAuth());
      
      // ✅ 1.5 second baad home page par redirect
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      await axiosClient.post('/user/resend-otp', { emailId });
      setSuccess('OTP resent successfully! Please check your email.');
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl">🔐 Verify Email</h2>
          
          <p className="text-sm text-center text-base-content/70 mt-2">
            We've sent a 6-digit OTP to <br />
            <strong className="text-primary">{emailId}</strong>
          </p>

          {error && (
            <div className="alert alert-error text-sm mt-2">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success text-sm mt-2">
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="mt-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Enter OTP</span>
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="input input-bordered w-full text-center text-2xl tracking-widest"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(val);
                }}
                maxLength={6}
                autoFocus
                disabled={loading || success.includes('success')}
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full mt-4 ${loading ? 'loading' : ''}`}
              disabled={loading || success.includes('success')}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          {/* Resend Section */}
          <div className="flex items-center justify-between mt-4 text-sm">
            <span className="text-base-content/60">
              {!canResend ? `Resend in ${timer}s` : 'Didn\'t receive OTP?'}
            </span>
            <button
              onClick={handleResend}
              className={`link link-primary ${!canResend || resendLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!canResend || resendLoading}
            >
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>

          <div className="divider text-xs text-base-content/40">OR</div>

          <div className="text-center">
            <NavLink to="/signup" className="link link-secondary text-sm">
              ← Back to Sign Up
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;