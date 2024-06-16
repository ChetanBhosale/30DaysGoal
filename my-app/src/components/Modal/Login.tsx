/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { FC, FormEvent, useEffect, useState } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { Ilogin, Zlogin } from "../../@types/auth";
import { toast } from "../ui/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";
import { useLoginUserMutation } from "@/store/api/authApi";
import { ReloadIcon } from "@radix-ui/react-icons";

interface LoginProps {
  onClose: () => void;
}

const Login: FC<LoginProps> = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<Ilogin>({
    email: "",
    password: "",
  });
  const [loginUser, { isSuccess, isLoading, isError, error }] =
    useLoginUserMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validity = Zlogin.safeParse(formData);
    if (!validity.success) {
      toast({
        title: "Error",
        description: "Please correct your credentials",
        variant: "destructive",
      });
      return;
    }
    await loginUser(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Logged in!",
        description: "Welcome to the application!",
      });
      onClose();
    }
    if (isError) {
      if (error) {
        let errorData = error as any;
        console.log(error);
        toast({
          title: "Error",
          description: errorData.data.message,
        });
      }
    }
  }, [isSuccess, isError, error]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">Login profile</DialogTitle>
        <DialogDescription>
          Thanks for logging into the system. We hope you achieve your goals!
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2 gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              placeholder="john@gmail.com"
              className="col-span-3"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="password"
                className="col-span-3"
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-10 top-0 right-2"
                variant="link"
                size="sm"
                type="button"
              >
                {showPassword ? <FaEyeSlash /> : <FaRegEye />}
              </Button>
            </div>
          </div>
        </div>
        {isLoading ? (
          <Button disabled className="mt-4 w-full">
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" className="mt-4 w-full">
            Login
          </Button>
        )}
      </form>
    </>
  );
};

export default Login;
