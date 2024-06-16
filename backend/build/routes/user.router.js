"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = __importDefault(require("../middleware/authentication"));
const auth_controller_1 = require("../controller/auth.controller");
const userRouter = (0, express_1.Router)();
userRouter.post("/register", auth_controller_1.register);
userRouter.post("/active-user", auth_controller_1.active_user);
userRouter.post("/login", auth_controller_1.login);
userRouter.get("/me", authentication_1.default, auth_controller_1.me);
userRouter.post("/logout", authentication_1.default, auth_controller_1.logout);
exports.default = userRouter;
