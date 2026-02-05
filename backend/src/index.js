import express from "express";
import cors from "cors";
import dbConfig from "./config/db.config.js";
import authRouter from "./auth/auth.controller.js";
import productsRouter from "./products/products.controller.js";
import categoriesRouter from "./categories/categories.controller.js";
import cartRouter from "./cart/cart.controller.js";
import userRouter from "./users/user.controller.js";
import ordersRouter from "./orders/orders.controller.js";
import adminRouter from "./admin/admin.controller.js";
import contactRouter from "./contact/contact.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS must be before other middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  }),
);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(express.json());

app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/cart", cartRouter);
app.use("/users", userRouter);
app.use("/orders", ordersRouter);
app.use("/admin", adminRouter);
app.use("/contact", contactRouter);

dbConfig().then(() => {
  app.listen(7001, () => {
    console.log("servel running on http://localhost:7001");
  });
});
