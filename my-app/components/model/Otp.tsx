import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@radix-ui/react-switch";
import React, { FC, useState } from "react";

import { FcGoogle } from "react-icons/fc";

type Props = {
  setPage: (num: number) => void;
};

const Otp: FC<Props> = ({ setPage }) => {
  return (
    <DialogContent className="sm:max-w-[500px] p-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-center">
          OTP
        </DialogTitle>
      </DialogHeader>
      <div>
        <div className="my-1 px-5 ">
          <Input type="email" placeholder="748541" className="mt-3" />
        </div>
      </div>

      <div className="my-3 px-5 mb-5 gap-4">
        <Button className="w-full my-2" onClick={() => setPage(3)}>
          Active Account
        </Button>
        <p className="text-center text-sm mt-5">
          back to{" "}
          <span
            onClick={() => setPage(1)}
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
