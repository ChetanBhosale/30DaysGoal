"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/ThemeModal";

import { IoLogoAlipay } from "react-icons/io5";
import Login from "@/components/Modal/Login";
import ModalComponent from "@/components/Modal/Modal";
import Signup from "../Modal/Signup";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { FaUserAstronaut } from "react-icons/fa";
import CustomDropdown from "../Dropdown/CustomDropdown";
import { useRouter } from "next/navigation";
const Navbar = () => {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  return (
    <div className="w-full shadow-sm sticky top-0 flex justify-between roboto px-6 items-center h-12">
      <h1
        onClick={() => router.push("/")}
        className="uppercase roboto tracking-widest cursor-pointer font-extrabold flex items-center gap-1"
      >
        <IoLogoAlipay size="20" />
        SUSTAINIQ.AI
      </h1>
      <div className="roboto gap-2 tracking-wide flex justify-center items-center">
        <ModeToggle />
        {user !== null && user !== undefined ? (
          <div>
            <CustomDropdown>
              <Button size="sm" variant="ghost">
                <Avatar>
                  <AvatarFallback>
                    <FaUserAstronaut size={20} />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </CustomDropdown>
          </div>
        ) : (
          <>
            <ModalComponent RenderComponent={Login}>
              <Button size="sm" variant="outline">
                Login
              </Button>
            </ModalComponent>
            <ModalComponent RenderComponent={Signup}>
              <Button size="sm">Sign up</Button>
            </ModalComponent>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
