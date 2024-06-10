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
import z from "zod";
import Otp from "./Otp";
import { useRegisterMutation } from "@/store/api/authApi";

interface ISignup extends Ilogin {
  confirmPassword: string;
}

const Zsignup = Zlogin.extend({
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Signup: FC<{ onClose: () => void }> = ({ onClose }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<ISignup>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [page, setPage] = useState(true);

  const [register, { isError, isSuccess, error, isLoading }] =
    useRegisterMutation();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validity = Zsignup.safeParse(formData);
    if (!validity.success) {
      const errorMessages = validity.error.errors
        .map((err) => err.message)
        .join(", ");
      toast({
        title: "Error",
        description: errorMessages,
        variant: "destructive",
      });
      return;
    }

    await register({ email: formData.email, password: formData.password });
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success!",
        description: "OTP sent to your email address!",
      });
      setPage(false);
    }
    if (isError) {
      if (error) {
        let errorData = error as any;
        toast({
          title: "Error",
          description: errorData.data.message,
        });
      }
    }
  }, [isError, isSuccess, error]);

  if (page) {
    return (
      <>
        <DialogHeader>
          <DialogTitle className="text-2xl">Signup</DialogTitle>
          <DialogDescription>
            Create an account to achieve your goals!
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
                  type={open ? "text" : "password"}
                  placeholder="password"
                  className="col-span-3"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Button
                  onClick={() => setOpen(!open)}
                  className="absolute z-10 top-0 right-2"
                  variant="link"
                  size="sm"
                  type="button"
                >
                  {open ? <FaEyeSlash /> : <FaRegEye />}
                </Button>
              </div>
            </div>
            <div className="items-center gap-4">
              <Label htmlFor="confirmPassword" className="text-right">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={open ? "text" : "password"}
                  placeholder="confirm password"
                  className="col-span-3"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <Button
                  onClick={() => setOpen(!open)}
                  className="absolute z-10 top-0 right-2"
                  variant="link"
                  size="sm"
                  type="button"
                >
                  {open ? <FaEyeSlash /> : <FaRegEye />}
                </Button>
              </div>
            </div>
          </div>
          <Button disabled={isLoading} type="submit" className="mt-4 w-full">
            Signup
          </Button>
        </form>
      </>
    );
  }

  return <Otp setPage={setPage} onClose={onClose} />;
};

export default Signup;
