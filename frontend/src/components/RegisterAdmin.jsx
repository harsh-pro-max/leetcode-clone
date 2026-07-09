import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerAdmin, logoutUser } from '../authSlice';

// ✅ Zod Schema (Signup jaisa, but lastName optional)
const adminSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  lastName: z.string().optional(), // Optional field
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

function RegisterAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminSchema),
    defaultValues: { lastName: '' } // lastName ko empty string default do
  });

  const onSubmit = (data) => {
    dispatch(registerAdmin(data)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        alert('✅ Admin registered successfully! Please login again.');
        // Backend ne cookie overwrite kar di hai, isliye hum logout karake redirect kar rahe hain
        dispatch(logoutUser());
        navigate('/login');
      } else {
        alert('❌ Registration failed: ' + (res.payload || 'Please try again.'));
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl mb-2">Register New Admin</h2>
          <p className="text-sm text-center text-base-content/70 mb-4">Only existing admins can create new accounts.</p>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* First Name Field */}
            <div className="form-control">
              <label className="label"><span className="label-text">First Name</span></label>
              <input
                type="text"
                placeholder="John"
                className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`}
                {...register('firstName')}
              />
              {errors.firstName && <span className="text-error text-sm mt-1">{errors.firstName.message}</span>}
            </div>

            {/* Last Name Field (Optional) */}
            <div className="form-control mt-4">
              <label className="label"><span className="label-text">Last Name (Optional)</span></label>
              <input
                type="text"
                placeholder="Doe"
                className={`input input-bordered w-full ${errors.lastName ? 'input-error' : ''}`}
                {...register('lastName')}
              />
              {errors.lastName && <span className="text-error text-sm mt-1">{errors.lastName.message}</span>}
            </div>

            {/* Email Field */}
            <div className="form-control mt-4">
              <label className="label"><span className="label-text">Email</span></label>
              <input
                type="email"
                placeholder="admin@example.com"
                className={`input input-bordered w-full ${errors.emailId ? 'input-error' : ''}`}
                {...register('emailId')}
              />
              {errors.emailId && <span className="text-error text-sm mt-1">{errors.emailId.message}</span>}
            </div>

            {/* Password Field with Toggle */}
            <div className="form-control mt-4">
              <label className="label"><span className="label-text">Password</span></label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <span className="text-error text-sm mt-1">{errors.password.message}</span>}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-8 flex justify-center">
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Creating Admin...' : 'Create Admin'}
              </button>
            </div>
          </form>

          {/* Back to Admin Panel */}
          <div className="text-center mt-6">
            <NavLink to="/admin" className="link link-secondary text-sm">
              ← Back to Admin Panel
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterAdmin;