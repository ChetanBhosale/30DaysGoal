/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { LuSendHorizonal } from "react-icons/lu";
import Chat from "@/components/Chat/Chat";
import { useGetQuestionChatQuery } from "@/store/api/aiApi";
import { toast } from "@/components/ui/use-toast";
import SkeletonChat from "@/components/Chat/SkeletonChat";
import { FaUserAstronaut } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { IoTodayOutline } from "react-icons/io5";

const View = () => {
  const path = useParams();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const { isLoading, isSuccess, isError, error, data } =
    useGetQuestionChatQuery(path.id[0]);

  const [chat, setChat] = useState<any>([]);

  useEffect(() => {
    if (isError) {
      const errorData = error as any;
      toast({
        variant: "destructive",
        title: "Error",
      });
    }
    if (isSuccess) {
      if (data.data.questions) {
        toast({
          variant: "destructive",
          title: "Question section is completed, please view plan!",
        });
        router.push("/dashboard");
      }
      setChat(
        data.data.questionChat.slice(1, data.data.questionChat.length + 1)
      );
    }
  }, [isError, isSuccess, error, data]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div className="1000px:w-[50vw] w-full relative border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
      <Button
        className=" block 1000px:hidden my-2 mx-4 "
        size="sm"
        onClick={() => router.back()}
        variant="ghost"
      >
        <IoTodayOutline size={20} />
      </Button>
      <ScrollArea
        ref={scrollAreaRef}
        className="h-[84vh] flex flex-col relative w-full p-5 bg-white dark:bg-gray-800 rounded-t-md overflow-y-auto"
      >
        {isLoading ? (
          <SkeletonChat />
        ) : (
          <div className="flex flex-col gap-6 py-6">
            {chat.map((ele: any, index: number) => (
              <div
                key={index}
                className={`flex gap-4 ${
                  ele.role === "user" ? "self-end" : "self-start"
                }`}
              >
                {ele.role === "model" && (
                  <div className="bg-blue-500 self-start w-8 h-8 rounded-full text-white flex justify-center items-center">
                    <FaUserAstronaut />
                  </div>
                )}
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    ele.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white"
                  }`}
                >
                  <p>{ele.parts[0].text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      <Chat path={path.id[0]} chat={chat} setChat={setChat} />
    </div>
  );
};

export default View;
