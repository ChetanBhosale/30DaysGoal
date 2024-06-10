import { NextFunction, Response, Request } from "express";
import { CatchAsyncError } from "../errors/CatchAsyncError";
import { genModel } from "../utility/gen-ai";
import ErrorHandler from "../errors/Errorhandler";
import { goalValidation } from "../@types/authentication";
import { chatWithGoalPlan, createPlan, initialPrompt } from "../prompts/prompt";
import { ChatContent, ChatHistory, User, UserGoal } from "../model/user.model";
import mongoose, { ObjectId } from "mongoose";
import { redis } from "../utility/redis";
import {
  IChatContent,
  IChatHistory,
  IUserGoal,
} from "../@types/models.interface";
import textToJson from "../utility/testToJson";
import path from "path";

export const setUserGoal = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ans: string = goalValidation.parse(req.body.ans);

      if (!ans) {
        return next(new ErrorHandler("Please provide a valid goal!", 401));
      }

      const checkGoal: any = await genModel.generateContent(
        `${initialPrompt}\nThe goal is: ${ans}`
      );
      const response = await checkGoal.response;
      const text: string = await response.text();
      console.log(text);

      if (text.includes("false")) {
        return next(new ErrorHandler("Please enter a valid goal!", 401));
      }

      const user: any = await User.findById(req.user._id)
        .populate("userGoal")
        .exec();

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const createUserGoal: IUserGoal | any = await UserGoal.create({
        goal: ans,
        user: user._id,
      });

      const createChatHistory = await ChatHistory.create({
        userGoal: createUserGoal._id,
      });

      createUserGoal.chatHistory = createChatHistory._id;
      await createUserGoal.save();

      const userChat = await ChatContent.create({
        role: "user",
        parts: [{ text: `${initialPrompt}\nThe goal is: ${ans}` }],
      });

      const modelChat = await ChatContent.create({
        role: "model",
        parts: [{ text }],
      });

      createChatHistory.questionChat.push(userChat._id as ObjectId);
      createChatHistory.questionChat.push(modelChat._id as ObjectId);
      await createChatHistory.save();

      user.userGoal.push(createUserGoal._id as ObjectId);
      await user.save();

      await redis.set(user._id.toString(), JSON.stringify(user));

      res.status(201).json({
        success: true,
        message: "User goal set successfully!",
        question: text,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getUserGoals = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const goals = await UserGoal.find({ user: req.user._id })
        .populate("chatHistory")
        .exec();

      res.status(201).json({
        success: true,
        data: goals,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const askQuestions = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chatHis = req.params.id;
      const { ans } = req.body;

      const history = await ChatHistory.findById(chatHis)
        .populate({
          path: "questionChat",
          select: "-_id -parts._id -createdAt -updatedAt -__v",
        })
        .exec();

      console.log(history);

      if (!history) {
        return next(new ErrorHandler("no chat history found!", 500));
      }

      const chats: any = history?.questionChat;

      console.log(chats);

      const prevChat = genModel.startChat({
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
          message: "plan generated successfully!",
        });
      }

      const userChat = await ChatContent.create({
        role: "user",
        parts: [{ text: ans }],
      });

      const modelChat = await ChatContent.create({
        role: "model",
        parts: [{ text }],
      });

      history?.questionChat.push(userChat._id as ObjectId);
      history?.questionChat.push(modelChat._id as ObjectId);

      await history.save();

      res.status(201).json({
        success: true,
        text,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

interface IPlan {
  day: number;
  goal: string;
  plan: string[];
  chat: any;
}

export const getQuestionChat = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const data = await ChatHistory.findById({ _id: id })
        .populate({
          path: "questionChat",
          select: "-_id -parts._id -createdAt -updatedAt -__v",
        })
        .exec();

      console.log(data);

      if (!data) {
        return next(new ErrorHandler("history not found", 500));
      }

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
async function generate30DaysPlan(
  chats: IChatContent[],
  history: IChatHistory
) {
  const chat = genModel.startChat({
    history: [...chats],
  });

  const result = await chat.sendMessage(createPlan);
  const response = await result.response;
  const text = response.text();

  console.log(text);
  const jsonData = textToJson(text);

  let promptCreation = await ChatContent.create({
    role: "user",
    parts: [
      {
        text: chatWithGoalPlan,
      },
    ],
  });

  jsonData.forEach((ele: IPlan) => {
    let dayPlan = {
      day: ele.day,
      goal: ele.goal,
      plan: ele.plan,
      chat: [promptCreation._id],
    };

    history.dayChat.push(dayPlan as IPlan);
  });

  await history.save();
}

export const getPlan = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chatHis = req.params.id;

      const data = await ChatHistory.findById(chatHis).populate({
        path: "dayChat.chat",
        model: "ChatContent",
        select: "-_id -createdAt -updatedAt -__v",
      });

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const chatWithDays = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { day, text } = req.body;
      const id = req.params.id;

      console.log(id);

      const data: IChatHistory | null = await ChatHistory.findById(id)
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

      console.log(data);

      if (data == null) {
        return next(new ErrorHandler("could now found plan!", 500));
      }

      let userCurrentDay: any = data.dayChat[day - 1];
      let prevChats = userCurrentDay.chat;

      const chat = genModel.startChat({
        history: [...data.questionChat, ...prevChats],
      });

      let result = await chat.sendMessage(text);
      let response = await result.response;

      const modelText = response.text();

      console.log(modelText);

      let userChat = await ChatContent.create({
        role: "user",
        parts: { text: text },
      });

      let modelChat = await ChatContent.create({
        role: "model",
        parts: { text: modelText },
      });

      data.dayChat[day - 1].chat.push(userChat._id as ObjectId);
      data.dayChat[day - 1].chat.push(modelChat._id as ObjectId);

      await data.save();

      res.status(201).json({
        success: true,
        text,
        result: modelText,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
