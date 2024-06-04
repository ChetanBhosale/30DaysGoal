import { z } from "zod";
import { IUserGoal } from "./models.interface";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string | null;
  userGoal?: IUserGoal | [] | null | undefined;
  public_id?: string | null;
  token?: string | null;
}

export const zodRegisterAndLogin = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "please enter atleast 8 character" }),
});

export const goalValidation = z
  .string()
  .min(20, "Please enter atleast 20 characters");

export type IRegister = z.infer<typeof zodRegisterAndLogin>;

export interface IDecode {
  id: string;
  email: string;
}
