import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo";
import AdminDelete from "./components/AdminDelete";
import AdminUpload from "./components/AdminUpload";
import AdminUpdate from "./components/AdminUpdate";
import AdminUpdateForm from "./components/AdminUpdateForm";
import RegisterAdmin from "./components/RegisterAdmin";
import Profile from "./pages/Profile";
import VerifyOTP from "./pages/VerifyOTP";

function App() {

  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <>
      <Routes>
        {/* ✅ PUBLIC ROUTES - No login required */}
        <Route path="/" element={<Homepage />} />
        
        {/* ✅ AUTH ROUTES - Only if NOT logged in */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />

        {/* ✅ OTP VERIFICATION ROUTE - Public */}
        <Route path="/verify-otp" element={<VerifyOTP />} />  

        {/* ✅ PROTECTED ROUTES - Login required */}
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        
        {/* ✅ PROBLEM PAGE - Login required (guest will be redirected to login) */}
        <Route path="/problem/:problemId" element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />} />

        {/* ✅ ADMIN ROUTES (Protected by Role) */}
        <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
        <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
        <Route path="/admin/register-admin" element={isAuthenticated && user?.role === 'admin' ? <RegisterAdmin /> : <Navigate to="/" />} />
        <Route path="/admin/update" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdate /> : <Navigate to="/" />} />
        <Route path="/admin/update/:id" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdateForm /> : <Navigate to="/" />} />
        <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
        <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;