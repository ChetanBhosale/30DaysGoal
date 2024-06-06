"use client";

import { useRouter } from "next/navigation";
import React, { FC, ReactNode, useState } from "react";
import { useSelector } from "react-redux";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const router = useRouter();

  const { user } = useSelector((state: any) => state.auth);

  if (!user || user == undefined || user == null) {
    router.push("/");
  } else {
    return <div>{children}</div>;
  }
};

export default Layout;
