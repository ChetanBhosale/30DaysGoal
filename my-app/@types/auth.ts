import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "password must be at least 8 characters.",
  }),
});

export const SignupForm = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "password must be at least 8 characters.",
  }),
});
