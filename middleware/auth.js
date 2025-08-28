const jwt = require('jsonwebtoken');
const { supabase } = require('../server');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user data from database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role, is_active')
      .eq('id', decoded.user_id)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token - user not found'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Add user info to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }

    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
      details: error.message
    });
  }
};

// Middleware to check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Convert single role to array for easier checking
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Middleware to check if user owns the resource or is admin
const requireOwnershipOrAdmin = (resourceTable, resourceIdField = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Admin can access everything
      if (req.user.role === 'admin') {
        return next();
      }

      // Get resource ID from params or body
      const resourceId = req.params[resourceIdField] || req.body[resourceIdField];
      
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          error: 'Resource ID required'
        });
      }

      // Check if user owns the resource
      const { data: resource, error } = await supabase
        .from(resourceTable)
        .select('user_id, owner_id')
        .eq(resourceIdField, resourceId)
        .single();

      if (error || !resource) {
        return res.status(404).json({
          success: false,
          error: 'Resource not found'
        });
      }

      // Check ownership (support both user_id and owner_id fields)
      const ownerId = resource.user_id || resource.owner_id;
      
      if (ownerId !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Access denied - you can only modify your own resources'
        });
      }

      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({
        success: false,
        error: 'Ownership verification failed',
        details: error.message
      });
    }
  };
};

// Middleware to check if user is restaurant owner or admin
const requireRestaurantAccess = () => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Admin can access everything
      if (req.user.role === 'admin') {
        return next();
      }

      // Restaurant owners can access their own restaurants
      if (req.user.role === 'restaurant_owner') {
        const restaurantId = req.params.id || req.body.restaurant_id;
        
        if (!restaurantId) {
          return res.status(400).json({
            success: false,
            error: 'Restaurant ID required'
          });
        }

        const { data: restaurant, error } = await supabase
          .from('restaurants')
          .select('owner_id')
          .eq('id', restaurantId)
          .single();

        if (error || !restaurant) {
          return res.status(404).json({
            success: false,
            error: 'Restaurant not found'
          });
        }

        if (restaurant.owner_id !== req.user.id) {
          return res.status(403).json({
            success: false,
            error: 'Access denied - you can only modify your own restaurants'
          });
        }

        return next();
      }

      // Regular customers cannot access restaurant management
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions - restaurant access required'
      });
    } catch (error) {
      console.error('Restaurant access check error:', error);
      res.status(500).json({
        success: false,
        error: 'Restaurant access verification failed',
        details: error.message
      });
    }
  };
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        const { data: user, error } = await supabase
          .from('users')
          .select('id, email, first_name, last_name, role, is_active')
          .eq('id', decoded.user_id)
          .single();

        if (!error && user && user.is_active) {
          req.user = user;
        }
      } catch (tokenError) {
        // Token is invalid, but we don't fail the request
        console.log('Optional auth: Invalid token provided');
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next(); // Continue without authentication
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireOwnershipOrAdmin,
  requireRestaurantAccess,
  optionalAuth
};
