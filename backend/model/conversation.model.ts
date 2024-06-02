import mongoose, { Document, ObjectId, Schema } from "mongoose";

interface IText extends Document {
  text: string;
}

interface IChatContent extends Document {
  role: string;
  parts: IText[];
  day?: number;
}

export interface IChatHistory extends Document {
  user: ObjectId;
  questionChat: ObjectId[];
  dayChat: [
    {
      day: number;
      goal: string;
      plan: string[];
      chat: ObjectId[];
    }
  ];
}

export const chatContentSchema: Schema<IChatContent> = new mongoose.Schema(
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

export const chatContentModel = mongoose.model<IChatContent>(
  "chatContent",
  chatContentSchema
);

export const chatHistorySchema: Schema<IChatHistory> = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "user",
    },
    questionChat: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chatContent",
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
            ref: "chatContent",
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const chatHistoryModel = mongoose.model<IChatHistory>(
  "chatHistory",
  chatHistorySchema
);
