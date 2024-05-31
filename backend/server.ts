import express, { Express, NextFunction, Request, Response } from "express";
import Errors from "./errors/Errors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import dbConnection from "./utility/db";
const app: Express = express();

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

dbConnection();

import User from "./routes/user.router";

app.use("/api/v1", User);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found!`) as any;
  err.statusCode = 400;
  next(err);
});
app.use(Errors);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("server started successfully!");
});
