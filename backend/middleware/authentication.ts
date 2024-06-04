import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../errors/CatchAsyncError";
import ErrorHandler from "../errors/Errorhandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { IDecode } from "../@types/authentication";
import { redis } from "../utility/redis";

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

      console.log(decode);

      if (!decode) {
        return next(new ErrorHandler("please login again!", 400));
      }

      let userRedis = await redis.get(decode.user._id);

      let data = JSON.parse(userRedis as string);

      if (!data) {
        return next(new ErrorHandler("unauthorized access!", 400));
      }
      req.user = decode.user;

      next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export default isAuthenticated;
