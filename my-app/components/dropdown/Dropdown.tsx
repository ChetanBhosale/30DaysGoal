import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { FC, ReactNode } from "react";
import { Button } from "../ui/button";

interface Props {
  children: React.ReactNode;
  Content: React.ReactNode;
}

const Dropdown: FC<Props> = ({ children, Content }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      {Content}
    </DropdownMenu>
  );
};

export default Dropdown;
