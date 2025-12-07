const { decodeToken } = require("../jwt-utils");


function authorize(requiredRoles = ["customer"]) {
  return function authorizeMiddleware(req, res, next) {
    try {
      const raw = req.get("Authorization") || "";
      const decoded = decodeToken(raw);
      if (!decoded || !decoded.roles) {
        return res.status(401).json({ errorMessage: "You don't have permission to access this resource" });
      }

      if (requiredRoles.includes("admin") && decoded.roles && decoded.roles.includes("admin")) {
        req.account = decoded;
        return next();
      }

      for (const role of requiredRoles) {
        if (role === "customer") {
          const isAdmin = decoded.roles && decoded.roles.includes("admin");
          const isCustomer = decoded.roles && decoded.roles.includes("customer");
          if (isAdmin || isCustomer) {
            req.account = decoded;
            return next();
          }
        } else {
          if (decoded.roles && decoded.roles.includes(role)) {
            req.account = decoded;
            return next();
          }
        }
      }

      return res.status(401).json({ errorMessage: "You don't have permission to access this resource" });
    } catch (err) {
      console.error("authorize error:", err);
      return res.status(401).json({ errorMessage: "You don't have permission to access this resource", action: "login" });
    }
  };
}

module.exports = authorize;
