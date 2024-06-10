"use client";

import * as React from "react";
import {
  DropdownMenuCheckboxItemProps,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutUserMutation } from "@/store/api/authApi";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import ModalComponent from "../Modal/Modal";
import Profile from "../Modal/Profile";

export default function CustomDropdown({
  children,
}: {
  children: React.ReactNode;
}) {
  const [logoutUser] = useLogoutUserMutation();
  const router = useRouter();
  async function handleLogout() {
    await logoutUser({});
    toast({
      title: "Logout Successful!",
      description: "Come back soon!",
    });
    router.push("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <ModalComponent RenderComponent={Profile}>
            <DropdownMenuItem
              disabled
              className="py-2 hover:outline-none hover:bg-secondary cursor-pointer px-4"
            >
              Profile
            </DropdownMenuItem>
          </ModalComponent>
          <DropdownMenuItem
            onClick={handleLogout}
            className="py-2  hover:outline-none hover:bg-secondary cursor-pointer px-4"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
