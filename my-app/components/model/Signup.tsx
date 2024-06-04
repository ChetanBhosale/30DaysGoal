"use client";

import { SignupForm } from "@/@types/auth"; // Assuming SignupForm schema exists
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@radix-ui/react-switch"; // Assuming Switch component is used
import React, { FC, useEffect, useState } from "react";

import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { useRegisterMutation } from "@/store/query/authApi";
// import { useRegisterMutation } from "@/store/query/authApi";

type Props = {
  setPage: (num: number) => void;
};

const Signup: FC<Props> = ({ setPage }) => {
  type ISignup = z.infer<typeof SignupForm>;

  const { toast } = useToast();

  const [user, setUser] = useState<ISignup>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [register, { data, error, isError, isSuccess, isLoading }] =
    useRegisterMutation();

  async function handleForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationResult = SignupForm.safeParse(user);
    if (!validationResult.success) {
      console.error("Validation errors:", validationResult.error);
      toast({
        variant: "destructive",
        description: validationResult.error.issues
          .map((issue) => issue.message)
          .join("\n"),
      });
      return;
    }

    if (user.password !== user.confirmPassword) {
      toast({
        variant: "destructive",
        description: "password must be same!",
      });
    }

    await register(user);
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  useEffect(() => {
    if (isSuccess) {
      setPage(3);
      toast({
        description: "OTP send to your email!",
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
  }, [error, isSuccess, isError]);

  return (
    <DialogContent className="sm:max-w-[500px] p-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-center">
          Create Account
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleForm}>
        <div className="my-3 px-2 mb-5">
          <div className="my-3 px-5 mb-2">
            <Label htmlFor="email" className="pl-2">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              id="email"
              value={user.email}
              placeholder="john@gmail.com"
              className="mt-3"
              onChange={handleChange}
            />
          </div>
          <div className="my-3 px-5 mb-2">
            <Label htmlFor="password" className="pl-2">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="john123"
              name="password"
              value={user.password}
              className="mt-3"
              onChange={handleChange}
            />
          </div>
          <div className="my-3 px-5 mb-2">
            <Label htmlFor="confirmPassword" className="pl-2">
              Confirm Password
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={user.confirmPassword}
              placeholder="Confirm password"
              className="mt-3"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="my-3 px-5 mb-5 gap-4">
          <Button className="w-full my-2" type="submit" disabled={isLoading}>
            Sign up
          </Button>
          <Button
            variant="ghost"
            className="w-full my-2 flex gap-2 items-center"
          >
            Sign up with <FcGoogle size={20} />
          </Button>
          <p className="text-center text-sm mt-5">
            if you already have an account then{" "}
            <span
              onClick={() => setPage(1)}
              className="text-blue-400 underline cursor-pointer"
            >
              login
            </span>
          </p>
        </div>
      </form>
    </DialogContent>
  );
};

export default Signup;
