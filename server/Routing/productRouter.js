import express from "express";
import authMiddleware from "../Utils/authMiddleware.js";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../Controller/productController.js";
const router = express.Router();
router.get("/product", authMiddleware, getProducts);
router.post("/product", authMiddleware, createProduct);
router.patch("/product/:id", authMiddleware, updateProduct);
router.delete("/product/:id", authMiddleware, deleteProduct);
export default router;
