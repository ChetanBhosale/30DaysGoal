import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../errors/CatchAsyncError";
import ErrorHandler from "../errors/Errorhandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import User from "../model/user.model";
import { IDecode } from "../@types/authentication";

const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.cookie?.split("=")[1];

      if (!token) {
        return next(new ErrorHandler("unauthorized access!", 400));
      }

      let decode = (await jwt.verify(
        token,
        process.env.ACCESS_TOKEN!
      )) as JwtPayload;

      if (!decode) {
        return next(new ErrorHandler("please login again!", 400));
      }

      let data = await User.findById({ _id: decode.id });

      if (!data) {
        return next(new ErrorHandler("unauthorized access!", 400));
      }

      req.user = decode;
      next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export default isAuthenticated;
