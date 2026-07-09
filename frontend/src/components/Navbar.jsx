import { NavLink } from 'react-router';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../authSlice';

// ✅ Props mein searchTerm aur setSearchTerm add kiye
function Navbar({ user, searchTerm, setSearchTerm }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // User initials for fallback avatar
  const initials = user?.firstName?.[0]?.toUpperCase() || 'U';

  return (
    <nav className="sticky top-0 z-50 bg-base-100 shadow-md border-b border-base-300 px-4 py-2">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>LeetCode</span>
        </NavLink>

        {/* ✅ Center: Search Bar (Functional) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <input
            type="text"
            placeholder="Search problems..."
            className="input input-bordered input-sm w-full bg-base-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Right: Conditional UI - Guest vs Logged-in */}
        <div className="flex items-center gap-3">
          {user ? (
            // ✅ Logged-in User: Profile Dropdown
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-2 rounded-full transition">
                <div className="avatar">
                  <div className="w-9 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="object-cover w-full h-full" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-primary text-primary-content font-bold text-sm">
                        {initials}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium hidden sm:inline-block">
                  {user?.firstName || 'User'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <ul className="mt-3 p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300">
                <li><NavLink to="/profile" className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>Profile</NavLink></li>
                {user?.role === 'admin' && (
                  <li><NavLink to="/admin" className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>Admin Panel</NavLink></li>
                )}
                <li><button onClick={handleLogout} className="flex items-center gap-2 text-error"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>Logout</button></li>
              </ul>
            </div>
          ) : (
            // ✅ Guest User: Login / Signup Buttons
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="btn btn-ghost btn-sm">
                Login
              </NavLink>
              <NavLink to="/signup" className="btn btn-primary btn-sm">
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;