import { Document, ObjectId } from "mongoose";

export interface IUserGoal extends Document {
  goal: string;
  chatHistory: ObjectId;
  user: ObjectId;
}

export interface IText {
  text: string;
}

export interface IChatContent extends Document {
  role: string;
  parts: IText[];
  day?: number;
}

export interface IChatHistory extends Document {
  userGoal: ObjectId;
  questionChat: ObjectId[];
  questions: Boolean;
  dayChat: {
    day: number;
    goal: string;
    plan: string[];
    chat: ObjectId[];
  }[];
}

export interface IUser extends Document {
  email: string;
  password?: string;
  token?: string;
  userGoal: ObjectId[];
  public_id?: string;
  banned: boolean;
}
