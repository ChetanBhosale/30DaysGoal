import z from "zod";

export const Zlogin = z.object({
  email: z.string().email(),
  password: z.string().min(8, "password must me alteast 8 characters!"),
});

export type Ilogin = z.infer<typeof Zlogin>;

export interface IinitialState {
  token: string | null;
  user: string | null;
}
