import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../errors/CatchAsyncError";
import { IRegister, zodRegisterAndLogin } from "../@types/authentication";
import ErrorHandler from "../errors/Errorhandler";
import { User } from "../model/user.model";
import generateSixDigitCode from "../utility/generateCode";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { redis } from "../utility/redis";
import sendMail from "../utility/sendMail";

export const register = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: IRegister = zodRegisterAndLogin.parse(
        req.body
      );

      if (!email || !password) {
        return next(
          new ErrorHandler("Please enter the correct credentials!", 400)
        );
      }

      const check: any = await User.findOne({
        email: new RegExp(`^${email}$`, "i"),
      });

      if (check) {
        return next(new ErrorHandler("User already exists", 400));
      }

      const code: string = generateSixDigitCode();

      const data = {
        code,
        email,
        password,
      };

      const token = jwt.sign(data, process.env.REGISTER_TOKEN!);

      await sendMail({
        email,
        subject: "Activate Your Account",
        template: "verification.ejs",
        data,
      });

      res
        .status(201)
        .cookie("register_token", token, {
          maxAge: 5 * 60 * 1000,
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .json({
          message: "OTP sent to your email!",
          token,
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const active_user = CatchAsyncError(
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

      await User.create({
        email,
        password: hashedPassword,
      });

      res.status(201).clearCookie("register_token").json({
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
      const { email, password }: IRegister = zodRegisterAndLogin.parse(
        req.body
      );

      if (!email || !password) {
        return next(
          new ErrorHandler("Please enter the correct credentials!", 400)
        );
      }

      const user: any = await User.findOne({
        email: new RegExp(`^${email}$`, "i"),
      });

      if (!user) {
        return next(new ErrorHandler("User doesn't exist!", 400));
      }

      const isPasswordValid = await bcrypt.compare(password, user.password!);
      if (!isPasswordValid) {
        return next(new ErrorHandler("Invalid credentials", 400));
      }

      await redis.set(user._id.toString(), JSON.stringify(user));

      if (user.password) {
        user.password = undefined;
      }

      const token: string = jwt.sign({ user }, process.env.ACCESS_TOKEN!, {
        expiresIn: "3h",
      });

      res.cookie("token", token, {
        maxAge: 3 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(200).json({
        message: "Login successful",
        token,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const logout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      redis.del(req.user._id as string);
      res
        .cookie("token", "", {
          maxAge: 1,
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .json({
          success: true,
          message: "Logout successful!",
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const me = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json({
        user: req.user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
