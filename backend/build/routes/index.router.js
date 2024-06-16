"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_router_1 = __importDefault(require("./user.router"));
const ai_router_1 = __importDefault(require("./ai.router"));
const indexRouter = (0, express_1.Router)();
indexRouter.use(user_router_1.default);
indexRouter.use(ai_router_1.default);
exports.default = indexRouter;
