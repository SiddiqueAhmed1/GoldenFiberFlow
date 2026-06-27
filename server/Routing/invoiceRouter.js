import express from "express";
import authMiddleware from "../Utils/authMiddleware.js";
import { createInvoice, deleteInvoice, getInvoices, updateInvoice } from "../Controller/invoiceController.js";
const router = express.Router();
router.get("/invoice", authMiddleware, getInvoices);
router.post("/invoice", authMiddleware, createInvoice);
router.patch("/invoice/:id", authMiddleware, updateInvoice);
router.delete("/invoice/:id", authMiddleware, deleteInvoice);
export default router;
