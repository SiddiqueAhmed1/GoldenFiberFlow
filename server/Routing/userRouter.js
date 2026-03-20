import express from "express";
import { registerUser } from "../Controller/UserController.js";

// init router
const router = express.Router();

router.post("/register", registerUser);

export default router;
