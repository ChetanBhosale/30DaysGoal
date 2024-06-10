"use client";

import React, { FC, FormEvent, useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { useActiveUserMutation } from "@/store/api/authApi";

interface OtpProps {
  setPage: (page: boolean) => void;
  onClose: () => void;
}

const Otp: FC<OtpProps> = ({ setPage, onClose }) => {
  const [value, setValue] = useState("");
  const [activeUser, { isError, isSuccess, error, isLoading }] =
    useActiveUserMutation();

  async function formSubmit(e: FormEvent) {
    e.preventDefault();
    if (value.length !== 6) {
      toast({
        title: "Error",
        description: "OTP should be 6 characters",
        variant: "destructive",
      });
      return;
    }
    await activeUser({ code: value });
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Registration successful!",
        description: "Please login to your account!",
      });
      onClose();
    }
    if (isError) {
      if (error) {
        let errorData = error as any;
        toast({
          title: "Error",
          description: errorData.data.message,
          variant: "destructive",
        });
      }
    }
  }, [isError, isSuccess, error, onClose]);

  return (
    <form onSubmit={formSubmit}>
      <div className="space-y-4 w-full p-4">
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 left-2"
          onClick={() => setPage(true)}
        >
          <IoIosArrowRoundBack />
        </Button>
        <h1 className="text-center">
          Please check your registered email address
        </h1>
        <InputOTP
          maxLength={6}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup className="w-full flex justify-center">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <div className="text-center text-sm">
          {value === "" ? (
            <>Enter your one-time password.</>
          ) : (
            <>You entered: {value}</>
          )}
        </div>
        <div className="flex justify-center items-center">
          <Button disabled={isLoading}>Submit</Button>
        </div>
      </div>
    </form>
  );
};

export default Otp;
