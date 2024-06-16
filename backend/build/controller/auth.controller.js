"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.logout = exports.login = exports.active_user = exports.register = void 0;
const CatchAsyncError_1 = require("../errors/CatchAsyncError");
const authentication_1 = require("../@types/authentication");
const Errorhandler_1 = __importDefault(require("../errors/Errorhandler"));
const user_model_1 = require("../model/user.model");
const generateCode_1 = __importDefault(require("../utility/generateCode"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const redis_1 = require("../utility/redis");
const sendMail_1 = __importDefault(require("../utility/sendMail"));
exports.register = (0, CatchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { email, password } = authentication_1.zodRegisterAndLogin.parse(req.body);
        if (!email || !password) {
            return next(new Errorhandler_1.default("Please enter the correct credentials!", 400));
        }
        const check = await user_model_1.User.findOne({
            email: new RegExp(`^${email}$`, "i"),
        });
        if (check) {
            return next(new Errorhandler_1.default("User already exists", 400));
        }
        const code = (0, generateCode_1.default)();
        const data = {
            code,
            email,
            password,
        };
        const token = jsonwebtoken_1.default.sign(data, process.env.REGISTER_TOKEN);
        await (0, sendMail_1.default)({
            email,
            subject: "Activate Your Account",
            template: "verification.ejs",
            data,
        });
        res
            .status(201)
            .cookie("register_token", token, {
            maxAge: 5 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
            .json({
            message: "OTP sent to your email!",
            token,
        });
    }
    catch (error) {
        return next(new Errorhandler_1.default(error.message, 500));
    }
});
exports.active_user = (0, CatchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { code } = req.body;
        const token = req.cookies.register_token;
        if (!token) {
            return next(new Errorhandler_1.default("No token found", 400));
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.REGISTER_TOKEN);
        }
        catch (err) {
            return next(new Errorhandler_1.default("Invalid or expired token", 400));
        }
        const { email, password, code: storedCode, } = decoded;
        if (code !== storedCode) {
            return next(new Errorhandler_1.default("Invalid activation code", 400));
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        await user_model_1.User.create({
            email,
            password: hashedPassword,
        });
        res.status(201).clearCookie("register_token").json({
            message: "Account activated successfully",
        });
    }
    catch (error) {
        return next(new Errorhandler_1.default(error.message, 500));
    }
});
exports.login = (0, CatchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { email, password } = authentication_1.zodRegisterAndLogin.parse(req.body);
        if (!email || !password) {
            return next(new Errorhandler_1.default("Please enter the correct credentials!", 400));
        }
        const user = await user_model_1.User.findOne({
            email: new RegExp(`^${email}$`, "i"),
        });
        if (!user) {
            return next(new Errorhandler_1.default("User doesn't exist!", 400));
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return next(new Errorhandler_1.default("Invalid credentials", 400));
        }
        await redis_1.redis.set(user._id.toString(), JSON.stringify(user));
        if (user.password) {
            user.password = undefined;
        }
        const token = jsonwebtoken_1.default.sign({ user }, process.env.ACCESS_TOKEN, {
            expiresIn: "3h",
        });
        res.cookie("token", token, {
            maxAge: 3 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({
            message: "Login successful",
            token,
            user,
        });
    }
    catch (error) {
        return next(new Errorhandler_1.default(error.message, 500));
    }
});
exports.logout = (0, CatchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        redis_1.redis.del(req.user._id);
        res
            .cookie("token", "", {
            maxAge: 1,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
            .json({
            success: true,
            message: "Logout successful!",
        });
    }
    catch (error) {
        return next(new Errorhandler_1.default(error.message, 500));
    }
});
exports.me = (0, CatchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        res.status(201).json({
            user: req.user,
        });
    }
    catch (error) {
        return next(new Errorhandler_1.default(error.message, 500));
    }
});
