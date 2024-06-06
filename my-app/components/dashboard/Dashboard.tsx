import Sidebar from "./Sidebar";
import React from "react";

type Props = {};

const Dashboard = (props: Props) => {
  return (
    <div className="w-full justify-center flex gap-2">
      <div className="min-h-[92vh] w-[25rem]">
        <Sidebar />
      </div>
      <div className="min-h-[90vh] w-[50rem] bg-green-500">as</div>
    </div>
  );
};

export default Dashboard;
