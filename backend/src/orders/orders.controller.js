import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { OrdersService } from "./orders.service.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import { updateOrderItemStatusSchema } from "../validations/order.validation.js";

const ordersRouter = Router();

ordersRouter.post("/checkout", authMiddleware(), OrdersService.checkout);

// view own orders
ordersRouter.get("/", authMiddleware(), OrdersService.getMyOrders);

//  view only items that you sold
ordersRouter.get(
  "/seller",
  authMiddleware(["seller", "admin"]),
  OrdersService.getSellerOrders,
);

// update status of own sold items
ordersRouter.patch(
  "/:orderId/items/:itemId/status",
  authMiddleware(["seller", "admin"]),
  validateMiddleware(updateOrderItemStatusSchema),
  OrdersService.updateOrderItemStatus,
);

ordersRouter.post(
  "/:orderId/items/:itemId/refund",
  authMiddleware(),
  OrdersService.refundOrderItem,
);

export default ordersRouter;
