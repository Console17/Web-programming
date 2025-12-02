import { Router } from "express";
import { ProductService } from "./products.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/createProduct.validation.js";
import upload from "../middlewares/multer.middleware.js";

const productsRouter = Router();

//public for all users
productsRouter.get("/", ProductService.getAllProducts);
productsRouter.get("/:id", ProductService.getProductById);

//seller/admin only
productsRouter.get(
  "/my-products",
  authMiddleware(["seller", "admin"]),
  ProductService.getMyProducts
);
productsRouter.post(
  "/",
  authMiddleware(["seller", "admin"]),
  upload.single("image"),
  validateMiddleware(createProductSchema),
  ProductService.createProduct
);
productsRouter.patch(
  "/:id",
  authMiddleware(["seller", "admin"]),
  upload.single("image"),
  validateMiddleware(updateProductSchema),
  ProductService.updateProduct
);
productsRouter.delete(
  "/:id",
  authMiddleware(["seller", "admin"]),
  ProductService.deleteProduct
);

export default productsRouter;
