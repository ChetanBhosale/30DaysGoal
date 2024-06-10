"use client";
import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface Props {
  children: React.ReactNode;
  RenderComponent: React.ComponentType<{ onClose: () => void }>;
}

const ModalComponent: FC<Props> = ({ children, RenderComponent }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <RenderComponent onClose={handleClose} />
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default ModalComponent;
