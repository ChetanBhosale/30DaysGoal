"use client";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import React from "react";

interface Props {
  children: React.ReactNode;
  Component: React.ReactNode;
}

export function ModalCur({ children, Component }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {Component}
    </Dialog>
  );
}
