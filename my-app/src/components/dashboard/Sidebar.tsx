import React from "react";
import { Button } from "../ui/button";
import ModalComponent from "../Modal/Modal";
import SetGoal from "../Modal/SetGoal";
import FetchedGoals from "./FetchedGoals";
import { useParams } from "next/navigation";

const Sidebar = () => {
  const path = useParams();

  return (
    <div
      className={`w-full 1000px:w-[30vw] space-y-3 ${
        (path?.id?.length == 1 && "hidden 1000px:block") || "block"
      } `}
    >
      <ModalComponent RenderComponent={SetGoal}>
        <Button
          size="lg"
          variant="outline"
          className="w-full uppercase rounded-none"
        >
          create your goal
        </Button>
      </ModalComponent>
      <div className=" h-[82vh] dark:bg-black bg-secondary shado">
        <FetchedGoals />
      </div>
    </div>
  );
};

export default Sidebar;
