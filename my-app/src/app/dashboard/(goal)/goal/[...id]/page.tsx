/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import SkeletonGoals from "@/components/Chat/SkeletonGoals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useGetDaysQuery } from "@/store/api/aiApi";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdVoiceChat } from "react-icons/md";

const Days = () => {
  const path = useParams();
  console.log(path.id[0]);

  const router = useRouter();

  const { data, isLoading, error, isSuccess, isError } = useGetDaysQuery({
    url: path.id[0],
  });

  const [day, setDays] = useState<any>([]);
  const [dayChat, setDayChat] = useState<any>(null);

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
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
    <div className="w-[50vw] h-[89vh] border border-gray-300 dark:border-gray-700 rounded-md shadow-lg overflow-hidden">
      <div className="h-[8vh] py-2 px-4 bg-gray-100 dark:bg-gray-700 flex items-center">
        <p className="text-gray-700 dark:text-gray-200">
          To chat with the AI for a particular day, click on the chat icon below
          each days details
        </p>
      </div>
      <ScrollArea className="h-full flex flex-col  pb-16 px-4 bg-white dark:bg-gray-800">
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
              <Button variant="ghost" className="mt-2" size="sm">
                <MdVoiceChat size="15" />
              </Button>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
};

export default Days;
