/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useState, useRef } from "react";
import { useGetGoalsQuery } from "@/store/api/aiApi";
import { Button } from "../ui/button";
import { WiDirectionUpRight } from "react-icons/wi";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import SkeletonGoals from "../Chat/SkeletonGoals";

const FetchedGoals = () => {
  const { data, isSuccess, isError, error, isLoading } = useGetGoalsQuery({});
  const [goalsData, setGoalsData] = useState<any>([]);
  const router = useRouter();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isError && error) {
      const errorData = error as any;
      toast({
        variant: "destructive",
        title: "Error",
        description: errorData.data.message,
      });
      return;
    }
    if (isSuccess) {
      setGoalsData(data.data);
      return;
    }

    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [isError, goalsData, error, isSuccess, data]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 h-full">
        <SkeletonGoals />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-full">
        Error loading goals
      </div>
    );
  }

  function handleComplete(id: string) {
    router.push(`/dashboard/process/${id}`);
  }

  return (
    <ScrollArea className="h-full w-full p-4 " ref={scrollAreaRef}>
      <div className="space-y-4">
        {goalsData.map((goal: any, index: number) => (
          <div
            key={index}
            className="p-4  border-2 shadow bg-white hover:bg-gray-100 flex flex-col rounded-md dark:bg-gray-800 dark:hover:bg-gray-950 dark:hover:border-gray-400"
          >
            <h1 className="text-sm font-normal tracking-wide cursor-pointer text-gray-800 leading-6 dark:text-gray-100">
              {goal?.goal}
            </h1>
            <div className="self-end flex flex-col w-full ">
              <div className="self-end">
                {goal.chatHistory?.questions ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 rounded-sm text-xs"
                    onClick={() =>
                      router.push(`/dashboard/goal/${goal.chatHistory._id}`)
                    }
                  >
                    View Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleComplete(goal.chatHistory._id)}
                    variant="link"
                    size="sm"
                    className="mt-2 flex items-center justify-center rounded-sm text-xs"
                  >
                    Complete Questions
                  </Button>
                )}
              </div>
              <p className="text-[10px] self-start opacity-60">
                {goal.createdAt.slice(0, 10)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default FetchedGoals;
