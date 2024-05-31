import { NextFunction, Request, response, Response } from "express";
import { CatchAsyncError } from "../errors/CatchAsyncError";
import ErrorHandler from "../errors/Errorhandler";
import { model } from "../utility/gen-ai";
import { initialPrompt } from "../prompts/prompt";
import User from "../model/user.model";

export const goalInformation = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { goal = "" } = req.body;
      let text = initialPrompt + "Goal : " + goal;

      const result: any = await model.generateContent(text);
      const response = await result.response;
      console.log(response.candidates[0].content.parts[0].text);
      console.log(response.candidates[0].content.role);

      if (response.candidates[0].content.parts[0].text.includes("false")) {
        await User.findByIdAndUpdate(
          { _id: req.user.id },
          {
            banned: true,
          }
        );

        return res.json({
          success: true,
          message: "you are banned from the application",
        });
      }

      res.json({
        success: true,
        response,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// export const providedGoal = await
