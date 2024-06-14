"use client";

import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "@/components/dashboard/Sidebar";

interface Props {
  children: ReactNode;
}

interface RootState {
  auth: {
    user: any; // Replace `any` with the actual type of `user` if known
  };
}

const Layout = ({ children }: Props) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) {
    return null; // Optionally, you can return a loading spinner or a message here
  }

  return (
    <div className="w-full flex-col 800px:flex-row my-4 flex justify-center gap-4 ">
      <Sidebar />
      {children}
    </div>
  );
};

export default Layout;
