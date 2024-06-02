import { CatchAsyncError } from "../errors/CatchAsyncError";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../errors/Errorhandler";
import { IDecode, IRegister, IUser } from "../@types/authentication";
import generateSixDigitCode from "../utility/generateCode";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model";
import { chatHistoryModel } from "../model/conversation.model";

export const register = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: IRegister = req.body;

      if (!email || !password) {
        return next(
          new ErrorHandler("Please enter the correct credentials!", 400)
        );
      }

      const check = await User.findOne({ email });

      if (check) {
        return next(new ErrorHandler("User already exists", 400));
      }

      let code: string = generateSixDigitCode();

      console.log(code);

      let data = {
        code,
        email,
        password,
      };

      let token = jwt.sign(data, process.env.REGISTER_TOKEN!);

      res.cookie("register_token", token, { maxAge: 5 * 60 * 1000 }).json({
        message: "OTP sent to your email!",
        token,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const activationAccount = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.body;

      const token = req.cookies.register_token;
      if (!token) {
        return next(new ErrorHandler("No token found", 400));
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.REGISTER_TOKEN!);
      } catch (err) {
        return next(new ErrorHandler("Invalid or expired token", 400));
      }

      const {
        email,
        password,
        code: storedCode,
      } = decoded as {
        email: string;
        password: string;
        code: string;
      };

      if (code !== storedCode) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      let data = await User.create({
        email,
        password: hashedPassword,
      });

      await chatHistoryModel.create({
        user: data._id,
      });

      res.clearCookie("register_token").json({
        message: "Account activated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const login = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: IRegister = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide credentials", 400));
      }

      const user = await User.findOne({ email });

      if (!user) {
        return next(new ErrorHandler("User does not exist", 400));
      }

      console.log(user);

      const isPasswordValid = await bcrypt.compare(password, user.password!);
      if (!isPasswordValid) {
        return next(new ErrorHandler("Invalid credentials", 400));
      }

      const token: string = jwt.sign(
        { id: user._id, email: user.email },
        process.env.ACCESS_TOKEN!,
        { expiresIn: "3h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const social = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const logout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("token", "", { maxAge: 1 }).json({
        success: true,
        message: "logout successful!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
