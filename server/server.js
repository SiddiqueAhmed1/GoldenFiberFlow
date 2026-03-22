import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import { mongoDb } from "./Config/mongoDb.js";
import userRouter from "./Routing/userRouter.js";
import consignmentRouter from "./Routing/consignmentRouter.js";
import cookieParser from "cookie-parser";

// config env
dotenv.config();

// init app
const app = express();
const port = process.env.PORT || 6060;

//config middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// use router
app.use("/api/v1", userRouter);
app.use("/api/v1", consignmentRouter);

// listen server
app.listen(port, () => {
  console.log(`server is running on port ${port}`.bgGreen.black);
  mongoDb();
});
