import React from "react";
import { Button } from "../ui/button";

const Sidebar = () => {
  let work = false;

  return (
    <div className="w-full h-full flex flex-col">
      <>
        <Button
          className="full rounded-none mb-1 border-2 border-gray-500 tracking-wider bg-gray-200 dark:text-black hover:dark:text-white"
          size="lg"
          variant="outline"
        >
          CREATE GOAL
        </Button>
      </>
      {work == false && (
        <div className="w-full h-full border-2 border-gray-600">
          <div className="w-full h-full justify-center items-center">
            Create Your First Goal Today!
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
