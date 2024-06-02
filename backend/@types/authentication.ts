import { z } from "zod";

export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  public_id?: string | null;
  token?: string | null;
}

export const zodRegisterAndLogin = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "please enter atleast 8 character" }),
});

export type IRegister = z.infer<typeof zodRegisterAndLogin>;

export interface IDecode {
  id: string;
  email: string;
}
