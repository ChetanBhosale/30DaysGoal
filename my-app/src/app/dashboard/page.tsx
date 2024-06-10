import Sidebar from "@/components/dashboard/Sidebar";
import View from "@/components/dashboard/View";
import { Button } from "@/components/ui/button";
import React, { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Dashboard: FC<Props> = ({ children }) => {
  return (
    <div className="w-[50vw] bg-secondary flex justify-center items-center">
      <h4 className="text-2xl font-bold ">Please select the process</h4>
    </div>
  );
};

export default Dashboard;
