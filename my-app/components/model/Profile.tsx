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
import { useLoadUserQuery } from "@/store/query/authApi";
import { Label } from "@radix-ui/react-dropdown-menu";

import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import LoadingPage from "../user/custom/LoadingPage";

type Props = {};

const Profile: FC<Props> = () => {
  const { data, isLoading, error }: any = useLoadUserQuery({});

  const [passwords, setPasswors] = useState({
    password: "",
    confirmPassword: "",
  });

  return (
    <DialogContent className="sm:max-w-[500px] p-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-left ml-5">
          Profile
        </DialogTitle>
      </DialogHeader>
      {isLoading ? (
        <>
          <LoadingPage />
        </>
      ) : (
        <>
          <div className="space-y-5">
            <div className="w-full flex justify-center items-center"></div>

            <div className="my-1 px-5 ">
              <Label className="">Email</Label>
              <Input
                type="email"
                readOnly
                disabled
                className="mt-3"
                defaultValue={data.user.email}
              />
            </div>
            <div className="my-1 px-5 ">
              <Label className="">Old Password</Label>
              <Input type="email" value={passwords.password} className="mt-3" />
            </div>
            <div className="my-1 px-5 ">
              <Label className="">NewPassword</Label>
              <Input
                type="email"
                value={passwords.confirmPassword}
                className="mt-3"
              />
            </div>
            <div className="mb-8 px-5 mb-5 gap-4">
              <Button className="w-full my-2">Change Password</Button>
            </div>
          </div>
        </>
      )}
    </DialogContent>
  );
};

export default Profile;
