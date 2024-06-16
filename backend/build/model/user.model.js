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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHistory = exports.ChatContent = exports.UserGoal = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// UserGoal Schema
const userGoalsSchema = new mongoose_1.Schema({
    goal: {
        type: String,
    },
    chatHistory: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "ChatHistory",
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });
const UserGoal = mongoose_1.default.model("UserGoal", userGoalsSchema);
exports.UserGoal = UserGoal;
// ChatContent Schema
const chatContentSchema = new mongoose_1.Schema({
    role: {
        type: String,
        required: true,
    },
    parts: {
        type: [
            {
                text: {
                    type: String,
                    required: true,
                },
            },
        ],
        required: true,
    },
    day: Number,
}, { timestamps: true });
const ChatContent = mongoose_1.default.model("ChatContent", chatContentSchema);
exports.ChatContent = ChatContent;
// ChatHistory Schema
const chatHistorySchema = new mongoose_1.Schema({
    userGoal: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "UserGoal",
    },
    questions: {
        type: Boolean,
        default: false,
    },
    questionChat: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "ChatContent",
        },
    ],
    dayChat: [
        {
            day: Number,
            goal: String,
            plan: [String],
            chat: [
                {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: "ChatContent",
                },
            ],
        },
    ],
}, { timestamps: true });
const ChatHistory = mongoose_1.default.model("ChatHistory", chatHistorySchema);
exports.ChatHistory = ChatHistory;
// User Schema
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please provide a valid email address",
        ],
    },
    password: {
        type: String,
    },
    token: {
        type: String,
    },
    public_id: {
        type: String,
    },
    userGoal: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "UserGoal",
        },
    ],
    banned: {
        type: Boolean,
        default: false,
    },
});
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
