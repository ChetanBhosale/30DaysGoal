import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../errors/CatchAsyncError";
import ErrorHandler from "../errors/Errorhandler";

export const userAuthentication = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
