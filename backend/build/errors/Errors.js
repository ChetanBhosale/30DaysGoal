"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Errorhandler_1 = __importDefault(require("./Errorhandler"));
// import { ZodError } from "zod";
const Errors = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    if (err.name === "CastError") {
        const message = `Resource not found, Invalid ${err.path}`;
        err = new Errorhandler_1.default(message, 400);
    }
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new Errorhandler_1.default(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
        const message = "Json web token is invalid, try again";
        err = new Errorhandler_1.default(message, 400);
    }
    if (err.name === "TokenExpiredError") {
        const message = "Json web token has expired, try again";
        err = new Errorhandler_1.default(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
exports.default = Errors;
