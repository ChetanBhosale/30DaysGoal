import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../errors/CatchAsyncError";
import ErrorHandler from "../errors/Errorhandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { redis } from "../utility/redis";
const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.headers.cookie);
      const cookies = req.headers.cookie;

      if (!cookies) {
        return next(new ErrorHandler("unauthorized access!", 400));
      }

      const tokenCookie = cookies
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));

      if (!tokenCookie) {
        return next(new ErrorHandler("unauthorized access!", 400));
      }

      const token = tokenCookie.split("=")[1];

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
