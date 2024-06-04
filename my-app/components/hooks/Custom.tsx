"use client";

import { useLoadUserQuery } from "@/store/query/authApi";
import React, { FC } from "react";
import LoadingPage from "../user/custom/LoadingPage";

interface Props {
  children: React.ReactNode;
}

const Custom: FC<Props> = ({ children }) => {
  const { isLoading } = useLoadUserQuery({});
  return <>{isLoading ? <LoadingPage /> : <>{children}</>}</>;
};

export default Custom;
