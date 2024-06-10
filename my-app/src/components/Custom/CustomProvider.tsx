"use client";

import { useLoadUserQuery } from "@/store/api/authApi";
import React, { FC } from "react";
import LoadingPage from "./LoadingPage";

interface Props {
  children: React.ReactNode;
}

const Custom: FC<Props> = ({ children }) => {
  const { isLoading } = useLoadUserQuery({});
  return <>{isLoading ? <LoadingPage /> : <>{children}</>}</>;
};

export default Custom;
