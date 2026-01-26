import { Router } from "express";
import { UserService } from "./user.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import depositSchema from "../validations/deposit.validation.js";

const userRouter = Router();

userRouter.post(
  "/deposit",
  authMiddleware(),
  validateMiddleware(depositSchema),
  UserService.deposit,
);

export default userRouter;
