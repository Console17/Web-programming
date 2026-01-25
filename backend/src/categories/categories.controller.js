import { Router } from "express";
import { CategoryService } from "./categories.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validation.js";

const categoriesRouter = Router();

categoriesRouter.post(
  "/",
  authMiddleware(["admin"]),
  validateMiddleware(createCategorySchema),
  CategoryService.createCategory,
);
categoriesRouter.get("/", CategoryService.getAllCategories);
categoriesRouter.get("/:id", CategoryService.getCategoryById);
categoriesRouter.patch(
  "/:id",
  authMiddleware(["admin"]),
  validateMiddleware(updateCategorySchema),
  CategoryService.updateCategory,
);
categoriesRouter.delete(
  "/:id",
  authMiddleware(["admin"]),
  CategoryService.deleteCategory,
);

export default categoriesRouter;
