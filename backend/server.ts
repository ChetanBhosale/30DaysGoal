import express, { Express, NextFunction, Request, Response } from "express";
import Errors from "./errors/Errors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import dbConnection from "./utility/db";
import * as dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";

dotenv.config({ path: __dirname + "/.env" });

const app: Express = express();

app.use(
  cors({
    origin: [
      "https://30-days-goal.vercel.app",
      "https://goalsetterapp-five.vercel.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

const limit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(limit);

app.use((req, res, next) => {
  console.log(
    `Request Method: ${req.method}, Request URL: ${req.url}, Origin: ${req.headers.origin}`
  );
  next();
});

dbConnection();

import indexRouter from "./routes/index.router";
app.use("/api/v1", indexRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found!`) as any;
  err.statusCode = 400;
  next(err);
});

app.use(Errors);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}!`);
});
