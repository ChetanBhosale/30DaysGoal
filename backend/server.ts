import express, { Express, NextFunction, Request, Response } from "express";
import Errors from "./errors/Errors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import dbConnection from "./utility/db";
import * as dotenv from "dotenv";
import path from "path";
import { rateLimit } from "express-rate-limit";

dotenv.config({ path: __dirname + "/.env" });

const app: Express = express();

// API request limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Middleware
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: [
    "https://30-days-goal-icrv.vercel.app",
    "http://localhost:3000",
    "https://goalsetter-six.vercel.app",
    "https://goal-setter-one.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "HEAD", "DELETE"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
  credentials: true,
};
app.use(cors(corsOptions));

// Log CORS options to verify they are set correctly
console.log("CORS Options:", corsOptions);

// Ensure the server responds to preflight requests
app.options("*", cors(corsOptions));

// Database connection
dbConnection();

// Basic routing
import indexRouter from "./routes/index.router";
app.use("/api/v1", indexRouter);

// Deployment
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/my-app/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "my-app", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully!");
  });
}

// Error handling for undefined routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found!`) as any;
  err.statusCode = 400;
  next(err);
});

app.use(limiter);

// Custom error handling middleware
app.use(Errors);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
});
