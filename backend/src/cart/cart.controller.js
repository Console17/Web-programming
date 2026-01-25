import { Router } from "express";
import { CartService } from "./cart.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import {
  addToCartSchema,
  updateCartItemSchema,
} from "../validations/cart.validation.js";

const cartRouter = Router();

cartRouter.get("/", authMiddleware(), CartService.getCart);
cartRouter.post(
  "/",
  authMiddleware(),
  validateMiddleware(addToCartSchema),
  CartService.addToCart
);
cartRouter.patch(
  "/:productId",
  authMiddleware(),
  validateMiddleware(updateCartItemSchema),
  CartService.updateCartItem
);
cartRouter.delete("/:productId", authMiddleware(), CartService.removeCartItem);
cartRouter.delete("/", authMiddleware(), CartService.emptyCart);

export default cartRouter;
