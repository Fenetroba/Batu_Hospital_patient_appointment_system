import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';


const PageProtector = ({ allowedRoles = [], children }) => {
    const location = useLocation();
    const {isLoading, isAuthenticated ,currentUser } = useSelector((state) => state.auth);


    // Show loading state while checking auth status
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // If not authenticated, redirect to login with return URL
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if(isAuthenticated && allowedRoles.includes('profile')){
        return <Navigate to="/profile" state={{ from: location }} replace />;
    }

    // If no specific roles required, allow access
    if (allowedRoles.length === 0) {
        return children;
    }

    // Check if user has required role
    const hasRequiredRole = currentUser?.role && allowedRoles.includes(currentUser.role);
    console.log(allowedRoles.includes(currentUser.role))
    
    // If user doesn't have required role, redirect to home
    if (!hasRequiredRole) {
        return <Navigate to="/" replace />;
    }

    // User is authenticated and has required role
    return children;
};

export default PageProtector;