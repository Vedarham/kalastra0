export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Role (${req.user.role}) not allowed`
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};