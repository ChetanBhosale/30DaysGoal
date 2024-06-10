import React from "react";
import { Skeleton } from "../ui/skeleton";

const SkeletonGoals = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-[100px] w-full rounded-xl" />
      <Skeleton className="h-[100px] w-full rounded-xl" />
      <Skeleton className="h-[100px] w-full rounded-xl" />
      <Skeleton className="h-[100px] w-full rounded-xl" />
      <Skeleton className="h-[100px] w-full rounded-xl" />
    </div>
  );
};

export default SkeletonGoals;
