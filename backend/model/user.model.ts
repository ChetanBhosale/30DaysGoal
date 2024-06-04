import mongoose, { Schema } from "mongoose";
import {
  IUserGoal,
  IChatContent,
  IChatHistory,
  IUser,
} from "../@types/models.interface";

// UserGoal Schema
const userGoalsSchema = new Schema<IUserGoal>(
  {
    goal: {
      type: String,
    },
    chatHistory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatHistory",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const UserGoal = mongoose.model<IUserGoal>("UserGoal", userGoalsSchema);

// ChatContent Schema
const chatContentSchema = new Schema<IChatContent>(
  {
    role: {
      type: String,
      required: true,
    },
    parts: {
      type: [
        {
          text: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
    },
    day: Number,
  },
  { timestamps: true }
);

const ChatContent = mongoose.model<IChatContent>(
  "ChatContent",
  chatContentSchema
);

// ChatHistory Schema
const chatHistorySchema = new Schema<IChatHistory>(
  {
    userGoal: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "UserGoal",
    },
    questions: {
      type: Boolean,
      default: false,
    },
    questionChat: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatContent",
      },
    ],
    dayChat: [
      {
        day: Number,
        goal: String,
        plan: [String],
        chat: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChatContent",
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const ChatHistory = mongoose.model<IChatHistory>(
  "ChatHistory",
  chatHistorySchema
);

// User Schema
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please provide a valid email address",
    ],
  },
  password: {
    type: String,
  },
  token: {
    type: String,
  },
  public_id: {
    type: String,
  },
  userGoal: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserGoal",
    },
  ],
  banned: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model<IUser>("User", userSchema);

// Export all models
export { User, UserGoal, ChatContent, ChatHistory };
