"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@radix-ui/react-switch";
import React, { FC, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FcGoogle } from "react-icons/fc";
import { loginFormSchema } from "@/@types/auth";
import { z } from "zod";
import { useLoginUserMutation } from "@/store/query/authApi";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

type Props = {
  setPage: (num: number) => void;
};

type ILogin = z.infer<typeof loginFormSchema>;

const Login: FC<Props> = ({ setPage }) => {
  const [user, setUser] = useState<ILogin>({
    email: "",
    password: "",
  });
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }

  const { toast } = useToast();

  const [loginUser, { isError, data, isSuccess, error }] =
    useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const validatedData = loginFormSchema.safeParse(user);

      if (!validatedData.success) {
        toast({
          variant: "destructive",
          description: validatedData.error.issues
            .map((issue) => issue.message)
            .join("\n"),
        });
        console.log(validatedData);
        return;
      }

      loginUser(user);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        description: "An error occurred during login.",
      });
    }
  };

  const handleGoogleLogin = () => {
    console.log("Login with Google");
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: data.message,
      });
    }
    if (isError) {
      if (error) {
        const errorData = error as any;
        toast({
          variant: "destructive",
          title: "Error",
          description: errorData.data.message,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, isSuccess, error]);

  return (
    <DialogContent className="sm:max-w-[500px] p-6 text-body ">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-center">
          Login
        </DialogTitle>
        <DialogDescription className="text-center mb-4">
          Enter your email and password to log in to your account.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="my-3 px-5 mb-5 ">
            <Label htmlFor="email" className="pl-2">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="john@gmail.com"
              className="mt-3"
            />
          </div>
          <div className="my-3 px-5 mb-2">
            <Label htmlFor="email" className="pl-2">
              Password
            </Label>
            <Input
              type="password"
              onChange={handleChange}
              name="password"
              placeholder="john123"
              className="mt-3"
            />
          </div>
        </div>

        <div className="my-3 px-5 mb-5 gap-4">
          <Button className="w-full my-2 uoper">Login</Button>
          <Button
            variant="ghost"
            onClick={() => signIn("google")}
            className="w-full my-2 flex gap-2 items-center"
            type="button"
          >
            login with <FcGoogle size={20} />
          </Button>
          <p className="text-center text-sm mt-5">
            if you dont have account then{" "}
            <span
              onClick={() => setPage(2)}
              className="text-blue-400 underline cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </div>
      </form>
    </DialogContent>
  );
};

export default Login;
