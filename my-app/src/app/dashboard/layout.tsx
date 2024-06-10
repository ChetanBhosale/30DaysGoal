"use client";

import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import Dashboard from "./page";
import Sidebar from "@/components/dashboard/Sidebar";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const { user } = useSelector((state: any) => state.auth);

  const router = useRouter();

  if (user) {
    return (
      <div className="w-full flex-col 800px:flex-row my-4 flex justify-center gap-4 ">
        <Sidebar />
        {children}
      </div>
    );
  }
  return router.push("/");
};

export default Layout;
