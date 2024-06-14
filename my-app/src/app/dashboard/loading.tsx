import { ReloadIcon } from "@radix-ui/react-icons";
import React from "react";

const loading = () => {
  return (
    <div className="w-[50vw] hidden  bg-secondary 1000px:flex justify-center items-center">
      <h4 className="text-2xl font-bold  ">
        {" "}
        <ReloadIcon className="text-lg animate-spin" />
      </h4>
    </div>
  );
};

export default loading;
