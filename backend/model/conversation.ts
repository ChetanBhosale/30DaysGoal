import mongoose, {
  Document,
  Model,
  ObjectId,
  Schema as MongooseSchema,
} from "mongoose";

enum user {
  User = "user",
  Model = "model",
}

interface IPart {
  _id: string;
  text: string;
}

interface IChat extends Document {
  _id: string;
  role: user;
  parts: IPart[];
}

interface IChatHistory extends Document {
  _id: string;
  goal: string;
  chat: IChat | ObjectId;
}

const partSchema = new mongoose.Schema<IPart>({
  text: {
    type: String,
    required: true,
  },
});

const chatSchema = new mongoose.Schema<IChat>(
  {
    role: {
      type: String,
      enum: user,
      required: true,
    },
    parts: [partSchema],
  },
  { timestamps: true }
);

const chatHistorySchema = new mongoose.Schema<IChatHistory>(
  {
    goal: {
      type: String,
      required: [true, "please insert your goal"],
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

export const PartModel: Model<IPart> = mongoose.model("Part", partSchema);
export const ChatModel: Model<IChat> = mongoose.model("Chat", chatSchema);
export const ChatHistoryModel: Model<IChatHistory> = mongoose.model(
  "ChatHistory",
  chatHistorySchema
);

// for converstion I need to make sure ai understand every questions and then ai will return true to move forward!
