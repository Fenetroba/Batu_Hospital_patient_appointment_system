import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
    // Try to get token from cookies first
    const token = req.cookies?.token;

    if (!token) {
        // If not in cookies, try Authorization header (for backward compatibility)
        const authHeader = req.headers['authorization'];
        const authToken = authHeader && authHeader.split(' ')[1];
        
        if (!authToken) {
            return res.status(401).json({ 
                success: false,
                message: 'Access token required' 
            });
        }
        
        // Verify the token from header
        return jwt.verify(authToken, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ 
                    success: false,
                    message: 'Invalid or expired token' 
                });
            }
            req.user = user;
            next();
        });
    }

    // Verify the token from cookie
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false,
                message: 'Invalid or expired token' 
            });
        }
        req.user = user;
        next();
    });
};

// Middleware to check role-based access
export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}, but you have: ${req.user.role}`
            });
        }

        next();
    };
};

// Middleware to check if user is active
export const requireActiveUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    // You can extend this to check an isActive field if you add it to the token payload
    next();
};