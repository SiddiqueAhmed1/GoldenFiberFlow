import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import { mongoDb } from "./Config/mongoDb.js";
import userRouter from "./Routing/userRouter.js";
import consignmentRouter from "./Routing/consignmentRouter.js";
import authRouter from "./Routing/authRouter.js";
import supplierRouter from "./Routing/supplierRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import driverRouter from "./Routing/driverRouter.js";
import vehicleRouter from "./Routing/vehicleRouter.js";
import warehouseRouter from "./Routing/warehouseRouter.js";
import productRouter from "./Routing/productRouter.js";

// config env
dotenv.config();

// init app
const app = express();
const port = process.env.PORT || 6060;

// use cors
app.use(
  cors({
    origin: ["https://golden-fiber-flow.vercel.app", "http://localhost:5173"],
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
  }),
);

//config middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// use router
app.use("/api/v1", userRouter);
app.use("/api/v1", consignmentRouter);
app.use("/api/v1", authRouter);
app.use("/api/v1", supplierRouter);
app.use("/api/v1", driverRouter);
app.use("/api/v1", vehicleRouter);
app.use("/api/v1", warehouseRouter);
app.use("/api/v1", productRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// listen server
app.listen(port, () => {
  console.log(`server is running on port ${port}`.bgGreen.black);
  mongoDb();
});
