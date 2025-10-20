import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';



const PageProtector = ({ allowedRoles = [], children }) => {
    // Get user from Redux
    const { currentUser } = useSelector((state) => state.auth);
    const location = useLocation();

    // If no user is logged in, go to login
    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // Check if user's role is allowed
    // If no roles specified, allow all logged-in users
    const canAccess = !allowedRoles.length || allowedRoles.includes(currentUser.role);
    
    // If not allowed, show unauthorized
    if (!canAccess) {
        return <Navigate to="/unauthorized" />;
    }

    // If allowed, show the page 
    return children;
};

export default PageProtector;