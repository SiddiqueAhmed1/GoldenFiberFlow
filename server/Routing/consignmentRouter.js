import express from "express";
import authMiddleware from "../Utils/authMiddleware.js";
import { createConsignment } from "../Controller/consignmentController.js";

// init router
const router = express.Router();

router.post("/createConsignment", authMiddleware, createConsignment);

export default router;
