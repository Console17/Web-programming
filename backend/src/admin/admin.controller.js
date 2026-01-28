import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { AdminService } from "./admin.service.js";

const adminRouter = Router();

adminRouter.get("/reports", authMiddleware(["admin"]), AdminService.reports);

export default adminRouter;
