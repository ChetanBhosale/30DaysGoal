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
const express_rate_limit_1 = require("express-rate-limit");
dotenv.config({ path: __dirname + "/.env" });
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["https://30-days-goal.vercel.app", "30-days-goal.vercel.app"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
const limit = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
});
app.use(limit);
app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}, Origin: ${req.headers.origin}`);
    next();
});
(0, db_1.default)();
const index_router_1 = __importDefault(require("./routes/index.router"));
app.use("/api/v1", index_router_1.default);
app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found!`);
    err.statusCode = 400;
    next(err);
});
app.use(Errors_1.default);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server started successfully on port ${PORT}!`);
});
