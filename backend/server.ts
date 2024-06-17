import express, { Express, NextFunction, Request, Response } from "express";
import Errors from "./errors/Errors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import dbConnection from "./utility/db";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/.env" });

const app: Express = express();

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());

const allowedOrigins = [
  "https://goalsetterapp-five.vercel.app",
  "https://goalsetter-ten.vercel.app",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Logging middleware
app.use((req, res, next) => {
  console.log(
    `Request Method: ${req.method}, Request URL: ${req.url}, Origin: ${req.headers.origin}`
  );
  next();
});

app.options("*", cors(corsOptions)); // Preflight requests handling

// Ensure CORS headers are set for all routes
app.use((req, res, next) => {
  const origin = req.headers.origin as string;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

dbConnection();

// Basic routing
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
