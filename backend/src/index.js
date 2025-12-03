import express from "express";
import cors from "cors";
import dbConfig from "./config/db.config.js";
import authRouter from "./auth/auth.controller.js";
import productsRouter from "./products/products.controller.js";

const app = express();

// CORS must be before other middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/auth", authRouter);
app.use("/products", productsRouter);

dbConfig().then(() => {
  app.listen(7001, () => {
    console.log("servel running on http://localhost:7001");
  });
});
