
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, requireAuth = false, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Wait until auth state is determined
    if (loading) return;

    if (requireAuth && !isAuthenticated) {
      // Redirect to login if auth is required but user is not logged in
      navigate('/login', { state: { from: location.pathname } });
    } else if (
      requireAuth &&
      isAuthenticated &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(user.role)
    ) {
      // Redirect to dashboard if user role doesn't match required roles
      const dashboardPath = user.role === 'musician' ? '/musician/dashboard' : '/creator/dashboard';
      navigate(dashboardPath);
    }
  }, [isAuthenticated, requireAuth, user, loading, navigate, location, allowedRoles]);

  // Show nothing while checking auth status
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse-tiktok h-5 w-5 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="pt-16 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
