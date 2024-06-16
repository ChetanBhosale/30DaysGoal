"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithDays = exports.getPlan = exports.getQuestionChat = exports.askQuestions = exports.getUserGoals = exports.setUserGoal = void 0;
const CatchAsyncError_1 = require("../errors/CatchAsyncError");
const gen_ai_1 = require("../utility/gen-ai");
const Errorhandler_1 = __importDefault(require("../errors/Errorhandler"));
const authentication_1 = require("../@types/authentication");
const prompt_1 = require("../prompts/prompt");
const user_model_1 = require("../model/user.model");
const redis_1 = require("../utility/redis");
const testToJson_1 = __importDefault(require("../utility/testToJson"));
exports.setUserGoal = (0, CatchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const ans = authentication_1.goalValidation.parse(req.body.ans);
        if (!ans) {
            return next(new Errorhandler_1.default("Please provide a valid goal!", 401));
        }
        const checkGoal = await gen_ai_1.genModel.generateContent(`${prompt_1.initialPrompt}\nThe goal is: ${ans}`);
        const response = await checkGoal.response;
        const text = await response.text();
        if (text.includes("false")) {
            return next(new Errorhandler_1.default("Please enter a valid goal!", 401));
        }
        const user = await user_model_1.User.findById(req.user._id)
            .populate("userGoal")
            .exec();
        if (!user) {
            return next(new Errorhandler_1.default("User not found", 404));
        }
        const createUserGoal = await user_model_1.UserGoal.create({
            goal: ans,
            user: user._id,
        });
        const createChatHistory = await user_model_1.ChatHistory.create({
            userGoal: createUserGoal._id,
        });
        createUserGoal.chatHistory = createChatHistory._id;
        await createUserGoal.save();
        const userChat = await user_model_1.ChatContent.create({
            role: "user",
            parts: [{ text: `${prompt_1.initialPrompt}\nThe goal is: ${ans}` }],
        });
        const modelChat = await user_model_1.ChatContent.create({
            role: "model",
            parts: [{ text }],
        });
        createChatHistory.questionChat.push(userChat._id);
        createChatHistory.questionChat.push(modelChat._id);
        await createChatHistory.save();
        user.userGoal.push(createUserGoal._id);
        await user.save();
        await redis_1.redis.set(user._id.toString(), JSON.stringify(user));
        res.status(201).json({
            success: true,
            message: "User goal set successfully!",
            question: text,
        });
    }
    catch (error) {
        return next(new Errorhandler_1.default(error.message, 500));
    }
});
exports.getUserGoals = (0, CatchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const goals = await user_model_1.UserGoal.find({ user: req.user._id })
            .populate("chatHistory")
            .exec();
        res.status(201).json({
            success: true,
            data: goals,
        });
    }
    catch (error) {
        return next(new Errorhandler_1.default(error.message, 500));
    }
});
exports.askQuestions = (0, CatchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const chatHis = req.params.id;
        const { ans } = req.body;
        const history = await user_model_1.ChatHistory.findById(chatHis)
            .populate({
            path: "questionChat",
            select: "-_id -parts._id -createdAt -updatedAt -__v",
        })
            .exec();
        if (!history) {
            return next(new Errorhandler_1.default("no chat history found!", 500));
        }
        const chats = history?.questionChat;
        const prevChat = gen_ai_1.genModel.startChat({
            history: [...chats],
        });
        let result = await prevChat.sendMessage(ans);
        const response = await result.response;
        const text = response.text();
        if (text.includes("True") || text.includes("true")) {
            history.questions = true;
            await generate30DaysPlan(chats, history);
            return res.status(201).json({
                success: true,
                text: "plan generated successfully!",
            });
        }
        const userChat = await user_model_1.ChatContent.create({
            role: "user",
            parts: [{ text: ans }],
        });
        const modelChat = await user_model_1.ChatContent.create({
            role: "model",
            parts: [{ text }],
        });
        history?.questionChat.push(userChat._id);
        history?.questionChat.push(modelChat._id);
        await history.save();
        res.status(201).json({
            success: true,
            text,
        });
    }
    catch (error) {
        return next(new Errorhandler_1.default(error.message, 500));
    }
});
exports.getQuestionChat = (0, CatchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await user_model_1.ChatHistory.findById({ _id: id })
            .populate({
            path: "questionChat",
            select: "-_id -parts._id -createdAt -updatedAt -__v",
        })
            .exec();
        if (!data) {
            return next(new Errorhandler_1.default("history not found", 500));
        }
        res.status(201).json({
            success: true,
            data,
        });
    }
    catch (error) {
        return next(new Errorhandler_1.default(error.message, 500));
    }
});
async function generate30DaysPlan(chats, history) {
    const chat = gen_ai_1.genModel.startChat({
        history: [...chats],
    });
    const result = await chat.sendMessage(prompt_1.createPlan);
    const response = await result.response;
    const text = response.text();
    const jsonData = (0, testToJson_1.default)(text);
    let promptCreation = await user_model_1.ChatContent.create({
        role: "user",
        parts: [
            {
                text: prompt_1.chatWithGoalPlan,
            },
        ],
    });
    jsonData.forEach((ele) => {
        let dayPlan = {
            day: ele.day,
            goal: ele.goal,
            plan: ele.plan,
            chat: [promptCreation._id],
        };
        history.dayChat.push(dayPlan);
    });
    await history.save();
}
exports.getPlan = (0, CatchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const chatHis = req.params.id;
        const data = await user_model_1.ChatHistory.findById(chatHis).populate({
            path: "dayChat.chat",
            model: "ChatContent",
            select: "-_id -createdAt -updatedAt -__v",
        });
        res.status(201).json({
            success: true,
            data,
        });
    }
    catch (error) {
        return next(new Errorhandler_1.default(error.message, 500));
    }
});
exports.chatWithDays = (0, CatchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { day, text } = req.body;
        const id = req.params.id;
        const data = await user_model_1.ChatHistory.findById(id)
            .populate([
            {
                path: "questionChat",
                select: "-_id -parts._id -createdAt -updatedAt -__v",
            },
            {
                path: "dayChat.chat",
                select: "-_id -parts._id -createdAt -updatedAt -__v",
            },
        ])
            .exec();
        if (data == null) {
            return next(new Errorhandler_1.default("could now found plan!", 500));
        }
        let userCurrentDay = data.dayChat[day - 1];
        let prevChats = userCurrentDay.chat;
        const chat = gen_ai_1.genModel.startChat({
            history: [...data.questionChat, ...prevChats],
        });
        let result = await chat.sendMessage(text);
        let response = await result.response;
        const modelText = response.text();
        let userChat = await user_model_1.ChatContent.create({
            role: "user",
            parts: { text: text },
        });
        let modelChat = await user_model_1.ChatContent.create({
            role: "model",
            parts: { text: modelText },
        });
        data.dayChat[day - 1].chat.push(userChat._id);
        data.dayChat[day - 1].chat.push(modelChat._id);
        await data.save();
        res.status(201).json({
            success: true,
            text,
            result: modelText,
        });
    }
    catch (error) {
        return next(new Errorhandler_1.default(error.message, 500));
    }
});
