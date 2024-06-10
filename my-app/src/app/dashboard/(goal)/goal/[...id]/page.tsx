/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ChatDays from "@/components/Chat/ChatDays";
import GoalPlan from "@/components/goal/GoalPlan";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useGetDaysQuery } from "@/store/api/aiApi";
import { removeAll } from "@/store/slice/aiSlice";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoTodayOutline } from "react-icons/io5";
import { IoPlaySkipBackOutline } from "react-icons/io5";
const Days = () => {
  const path = useParams();

  const router = useRouter();

  const { data, isLoading, error, isSuccess, isError } = useGetDaysQuery({
    url: path.id[0],
  });

  const [days, setDays] = useState<any>([]);
  const { changed } = useSelector((state: any) => state.ai);
  const dispatch = useDispatch();

  const { day } = useSelector((state: any) => state.ai);

  function removeSlice() {
    dispatch(removeAll());
  }

  useEffect(() => {
    if (isSuccess) {
      setDays(data.data.dayChat);
    }

    if (isError) {
      const errorData = error as any;
      toast({
        variant: "destructive",
        title: "Error",
        description: errorData.message,
      });
      return;
    }
  }, [isError, isSuccess, data]);

  return (
    <div className="1000px:w-[50vw] w-full h-[89vh] border border-gray-300 dark:border-gray-700 rounded-md shadow-lg overflow-hidden">
      <div className="h-[8vh] w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 flex items-center">
        <Button
          className=" block 1000px:hidden my-2 mx-4 "
          size="sm"
          variant="ghost"
          onClick={() => router.back()}
        >
          <IoPlaySkipBackOutline size={20} />
        </Button>
        <p className="text-gray-700 w-full dark:text-gray-200">
          {changed === false ? (
            " To chat with the AI for a particular day, click on the chat icon below each days details"
          ) : (
            <div className="flex gap-2 justify-between w-full items-center">
              <div className="">{days[day - 1]?.goal}</div>
              <Button
                variant="ghost"
                className="self-end 1000px:block"
                size="sm"
                onClick={removeSlice}
              >
                <IoTodayOutline size={20} />
              </Button>
            </div>
          )}
        </p>
      </div>
      {changed === false ? (
        <GoalPlan day={days} isLoading={isLoading} />
      ) : (
        <>
          <ChatDays />
        </>
      )}
    </div>
  );
};

export default Days;
