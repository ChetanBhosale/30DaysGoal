"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = __importDefault(require("../middleware/authentication"));
const ai_controller_1 = require("../controller/ai.controller");
const aiRouter = (0, express_1.Router)();
aiRouter.post("/goal", authentication_1.default, ai_controller_1.setUserGoal);
aiRouter.get("/goal", authentication_1.default, ai_controller_1.getUserGoals);
aiRouter.get("/goal/chat-questions/:id", authentication_1.default, ai_controller_1.getQuestionChat);
aiRouter.post("/goal/chat-questions/:id", authentication_1.default, ai_controller_1.askQuestions);
aiRouter.get("/goal-plan/:id", authentication_1.default, ai_controller_1.getPlan);
aiRouter.post("/goal-plan/chat/:id", authentication_1.default, ai_controller_1.chatWithDays);
exports.default = aiRouter;
