import {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { useLogoutUserMutation } from "@/store/query/authApi";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import React, { useEffect } from "react";
import { RxExit } from "react-icons/rx";
import { toast } from "../ui/use-toast";
import { AnyListenerPredicate } from "@reduxjs/toolkit";
import { Modal } from "../model/Modal";
import { ModalCur } from "../model/ModelCur";
import Profile from "../model/Profile";

const ProfileContent = () => {
  const [logoutUser, { isSuccess, error, isError }] = useLogoutUserMutation({});
  function handleLogout() {
    try {
      logoutUser({});
      toast({
        title: "Logout Successful!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  }
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Logout Successful!",
      });
    }
    if (isError) {
      if (error) {
        const errorData = error as any;
        console.log(errorData);
        toast({
          title: "Error",
          //   description: errorData.data.message,
        });
      }
    }
  }, [error, isError, isSuccess]);
  return (
    <DropdownMenuContent className="w-56 mr-8">
      <ModalCur Component={<Profile />}>
        <DropdownMenuItem
          disabled
          className="px-2 justify-center flex items-center py-2 cursor-pointer w-full hover:border-none hover:outline-none hover:bg-gray-100 hover:text-black hover:dark:text-black hover:dark:bg-white "
        >
          <span>Profile</span>
          <DropdownMenuShortcut>⌘</DropdownMenuShortcut>
        </DropdownMenuItem>
      </ModalCur>

      <DropdownMenuItem
        onClick={handleLogout}
        className="px-2 justify-center flex items-center py-2 cursor-pointer w-full hover:border-none hover:outline-none hover:bg-gray-100 hover:text-black hover:dark:text-black hover:dark:bg-white "
      >
        <span>Logout</span>
        <DropdownMenuShortcut>
          <RxExit />
        </DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default ProfileContent;
