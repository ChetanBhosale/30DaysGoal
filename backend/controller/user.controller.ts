import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../errors/CatchAsyncError";
import ErrorHandler from "../errors/Errorhandler";
import { genModel } from "../utility/gen-ai";
import { chatWithGoalPlan, createPlan, initialPrompt } from "../prompts/prompt";
import {} from "../model/user.model";

import { User } from "../model/user.model";
import textToJson from "../utility/testToJson";
import { ObjectId } from "mongoose";

export const setGoal = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { goal = "" } = req.body;

      const promptText = initialPrompt + "user goal is : " + goal;

      const result: any = await genModel.generateContent(promptText);
      const output = await result.response;
      const parts = output.candidates[0].content.parts;
      console.log(output.candidates[0].content.parts);

      if (parts[0].text.includes("false")) {
        await User.findByIdAndUpdate(req.user.id, {
          banned: true,
        });

        res.cookie("token", "", { maxAge: 0 });

        return next(
          new ErrorHandler("you are banned from the application", 400)
        );
      }

      const userResponse = await chatContentModel.create({
        role: "user",
        parts: [{ text: initialPrompt + "user goal is : " + goal }],
      });

      const modelResponse = await chatContentModel.create({
        role: "model",
        parts: parts,
      });

      Store(res, req, userResponse, modelResponse, output, parts);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const provideQuestionsAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer = "" } = req.body;

      const data: any = await chatHistoryModel
        .findOne({ user: req.user.id })
        .populate({
          path: "questionChat",
          select: "-_id -parts._id -createdAt -updatedAt -__v",
        })
        .exec();

      if (!data) {
        next(new ErrorHandler("data not found!", 500));
      }

      const chat = await genModel.startChat({
        history: [...data?.questionChat],
      });

      const result = await chat.sendMessage(answer);
      const output: any = await result.response;
      const parts = output.candidates[0].content.parts;

      if (parts[0].text.includes("true")) {
        return res.json({
          success: true,
          session: true,
          message: "creating 30 days of goal plan for you!",
        });
      }

      const userResponse = await chatContentModel.create({
        role: "user",
        parts: [{ text: answer }],
      });

      const modelResponse = await chatContentModel.create({
        role: "model",
        parts: parts,
      });

      Store(res, req, userResponse, modelResponse, output, parts);
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

interface IPlan {
  day: number;
  goal: string;
  plan: string[];
}

export const PlanCreationPhase = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: any = await chatHistoryModel
        .findOne({ user: req.user.id })
        .populate({
          path: "questionChat",
          select: "-_id -parts._id -createdAt -updatedAt -__v",
        })
        .exec();

      console.log(data);
      console.log("work till here");
      const chat = await genModel.startChat({
        history: [...data?.questionChat],
      });

      const result = await chat.sendMessage(createPlan);
      const output: any = await result.response;
      const text = output.text();

      const jsonData = textToJson(text);

      let promptCreation = await chatContentModel.create({
        role: "user",
        parts: [
          {
            text: chatWithGoalPlan,
          },
        ],
      });

      jsonData.forEach((ele: IPlan) => {
        let dayPlans = {
          day: ele.day,
          goal: ele.goal,
          plan: ele.plan,
          chat: [promptCreation._id],
        };

        data.dayChat.push(dayPlans);
      });

      data.save();

      res.json({
        success: true,
        jsonData,
        message: "day plan as been created successfully!",
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

      const data: IChatHistory | null = await chatHistoryModel
        .findOne({ user: req.user.id })
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

      if (data == null)
        return next(new ErrorHandler("could not found plan!", 500));

      let userCurrentDay: any = data.dayChat[day - 1];

      let prevChats = userCurrentDay.chat;

      const chat = genModel.startChat({
        history: [...data.questionChat, ...prevChats],
      });

      let result = await chat.sendMessage(text);
      let response = await result.response;

      const modelText = response.text();

      console.log(modelText);

      let userChat = await chatContentModel.create({
        role: "user",
        parts: { text: text },
      });

      let modelChat = await chatContentModel.create({
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

export const getPlanAndChat = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IChatHistory | null = await chatHistoryModel
        .findOne({ user: req.user.id })
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

      res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export async function Store(
  res: Response,
  req: Request,
  userResponse: any,
  modelResponse: any,
  output: any,
  parts: [{ text: string }]
) {
  let findHistory = await chatHistoryModel.findOne({ user: req.user.id });

  if (findHistory) {
    console.log("Existing history found:", findHistory);
    findHistory.questionChat.push(userResponse._id);
    findHistory.questionChat.push(modelResponse._id);
    await findHistory.save();
  } else {
    console.log("Creating new history for user:", req.user.id);
    await chatHistoryModel.create({
      user: req.user.id,
      questionChat: [userResponse._id, modelResponse._id],
    });
  }

  res.json({
    success: true,
    output,
    parts,
  });
}
