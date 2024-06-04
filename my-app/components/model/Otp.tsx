"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useActiveUserMutation } from "@/store/query/authApi";
import React, { FC, useEffect, useState } from "react";
import { toast } from "../ui/use-toast";

type Props = {
  setPage: (num: number) => void;
};

const Otp: FC<Props> = ({ setPage }) => {
  const [code, setCode] = useState<string>("");

  const [activeUser, { isError, isSuccess, isLoading, error }] =
    useActiveUserMutation();

  async function handleSubmit() {
    if (code.length !== 6) {
      toast({
        variant: "destructive",
        description: "OTP should be of 8 characters",
      });
      return;
    }

    activeUser({ code });
  }

  useEffect(() => {
    if (isSuccess) {
      // setPage(3);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Account created successfully!",
      });
      setPage(1);
    }
    if (isError) {
      if (error) {
        const errorData = error as any;
        console.log(errorData);
        // toast({
        //   variant: "destructive",
        //   description: errorData.data.message,
        // });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSuccess, isError]);

  return (
    <DialogContent className="sm:max-w-[500px] p-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-center">
          OTP
        </DialogTitle>
      </DialogHeader>
      <div>
        <div className="my-1 px-5 ">
          <Input
            type="email"
            onChange={(e) => setCode(e.target.value)}
            placeholder="748541"
            className="mt-3"
          />
        </div>
      </div>

      <div className="my-3 px-5 mb-5 gap-4">
        <Button className="w-full my-2" onClick={handleSubmit}>
          Active Account
        </Button>
        <p className="text-center text-sm mt-5">
          back to{" "}
          <span
            onClick={() => setPage(2)}
            className="text-blue-400 underline cursor-pointer"
          >
            sign up
          </span>
        </p>
      </div>
    </DialogContent>
  );
};

export default Otp;
