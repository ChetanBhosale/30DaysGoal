"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CatchAsyncError_1 = require("../errors/CatchAsyncError");
const Errorhandler_1 = __importDefault(require("../errors/Errorhandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../utility/redis");
const isAuthenticated = (0, CatchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const cookies = req.headers.cookie;
        if (!cookies) {
            return next(new Errorhandler_1.default("unauthorized access!", 400));
        }
        const tokenCookie = cookies
            .split("; ")
            .find((cookie) => cookie.startsWith("token="));
        if (!tokenCookie) {
            return next(new Errorhandler_1.default("unauthorized access!", 400));
        }
        const token = tokenCookie.split("=")[1];
        if (!token) {
            return next(new Errorhandler_1.default("unauthorized access!", 400));
        }
        let decode = (await jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN));
        if (!decode) {
            return next(new Errorhandler_1.default("please login again!", 400));
        }
        let userRedis = await redis_1.redis.get(decode.user._id);
        let data = JSON.parse(userRedis);
        if (!data) {
            return next(new Errorhandler_1.default("unauthorized access!", 400));
        }
        req.user = decode.user;
        next();
    }
    catch (error) {
        return next(new Errorhandler_1.default(error.message, 500));
    }
});
exports.default = isAuthenticated;
