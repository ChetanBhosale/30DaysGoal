"use client";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import React, { FC, useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import Otp from "./Otp";

interface Props {
  children: React.ReactNode;
}

export function Modal({ children }: Props) {
  const [page, setPage] = useState<number>(1);
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {page === 1 && <Login setPage={setPage} />}
      {page === 2 && <Signup setPage={setPage} />}
      {page === 3 && <Otp setPage={setPage} />}
    </Dialog>
  );
}
