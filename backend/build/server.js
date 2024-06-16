"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Errors_1 = __importDefault(require("./errors/Errors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const db_1 = __importDefault(require("./utility/db"));
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
const express_rate_limit_1 = require("express-rate-limit");
dotenv.config({ path: __dirname + "/.env" });
const app = (0, express_1.default)();
//api request limiter
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 100,
    max: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
});
// Middleware
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
// CORS Configuration
app.use((0, cors_1.default)({
    origin: [
        "https://30-days-goal-icrv.vercel.app",
        "http://localhost:3000",
        "https://goalsetter-six.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "HEAD", "DELETE"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
    credentials: true,
}));
// Database connection
(0, db_1.default)();
// Basic routing
const index_router_1 = __importDefault(require("./routes/index.router"));
app.use("/api/v1", index_router_1.default);
// deployment
const __dirname1 = path_1.default.resolve();
if (process.env.NODE_ENV == "production") {
    app.use(express_1.default.static(path_1.default.join(__dirname1, "/my-app/build")));
    app.get("*", (req, res) => { });
}
else {
    app.get("/", (req, res) => {
        res.send("API is running successfully!");
    });
}
// Error handling for undefined routes
app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found!`);
    err.statusCode = 400;
    next(err);
});
app.use(limiter);
// Custom error handling middleware
app.use(Errors_1.default);
// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server started successfully on port ${PORT}`);
});
