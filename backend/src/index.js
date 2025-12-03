import express from "express";
import cors from "cors";
import dbConfig from "./config/db.config.js";
import authRouter from "./auth/auth.controller.js";
import productsRouter from "./products/products.controller.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS must be before other middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true,
  })
);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(express.json());

app.use("/auth", authRouter);
app.use("/products", productsRouter);

dbConfig().then(() => {
  app.listen(7001, () => {
    console.log("servel running on http://localhost:7001");
  });
});
