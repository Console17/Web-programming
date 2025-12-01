import jwt from "jsonwebtoken";
import "dotenv/config";

export const authMiddleware =
  (roles = []) =>
  (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "token not provided" });

    const token = authHeader.split(" ")[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
