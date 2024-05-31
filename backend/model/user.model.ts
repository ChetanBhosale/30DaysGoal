import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  token?: string;
  public_id?: string;
  banned: boolean;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
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
  banned: {
    type: Boolean,
    default: false,
  },
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
