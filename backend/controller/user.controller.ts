import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../errors/CatchAsyncError";
import ErrorHandler from "../errors/Errorhandler";
import { genModel } from "../utility/gen-ai";
import { createPlan, initialPrompt } from "../prompts/prompt";
import {
  chatContentModel,
  chatHistoryModel,
} from "../model/conversation.model";

import User from "../model/user.model";

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

      // jsonData.forEach(async (ele: IPlan,index:number) => {
      //   data.day = index + 1,
      // });

      res.json({
        success: true,
        jsonData,
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

function textToJson(text: string) {
  // Remove leading/trailing whitespaces and newlines
  text = text.trim();

  // Remove backticks and 'json' to get pure JSON string
  text = text.replace(/^```json\n/, "").replace(/```$/, "");

  // Parse the JSON string
  const jsonData = JSON.parse(text);

  return jsonData;
}
