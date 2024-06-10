"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import React, { FC } from "react";
import SkeletonGoals from "../Chat/SkeletonGoals";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MdVoiceChat } from "react-icons/md";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { viewDay } from "@/store/slice/aiSlice";

interface Props {
  day: any;
  isLoading: boolean;
}

const GoalPlan: FC<Props> = ({ day, isLoading }) => {
  const dispatch = useDispatch();

  function handleChange(index: number, chat: any) {
    dispatch(
      viewDay({ change: true, day: index, chat: chat.slice(1, chat.length) })
    );
  }

  const router = useRouter();
  const path = useParams();
  return (
    <ScrollArea className="h-full flex flex-col  pb-16 px-4 bg-white dark:bg-gray-800 ">
      {isLoading ? (
        <SkeletonGoals />
      ) : (
        day.map((ele: any, index: number) => (
          <div
            key={index}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-md my-4 px-4 py-4 bg-gray-50 dark:bg-gray-900"
          >
            <Badge variant="outline" className="mb-2">
              Day {index + 1}
            </Badge>
            <p className="text-gray-800 font-semibold dark:text-gray-200 mb-2">
              {ele.goal}
            </p>
            <ul className="list-disc pl-5 mb-2 text-sm text-gray-700 dark:text-gray-300">
              {ele.plan.map((plan: any, planIndex: number) => (
                <li key={planIndex}>{plan}</li>
              ))}
            </ul>
            <Button
              variant="ghost"
              onClick={() => handleChange(ele.day, ele.chat)}
              className="mt-2"
              size="sm"
            >
              <MdVoiceChat size="15" />
            </Button>
          </div>
        ))
      )}
    </ScrollArea>
  );
};

export default GoalPlan;
