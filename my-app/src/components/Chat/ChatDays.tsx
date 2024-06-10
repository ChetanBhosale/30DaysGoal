"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import SkeletonChat from "./SkeletonChat";
import { useSelector } from "react-redux";
import { FaUserAstronaut } from "react-icons/fa";
import InputBox from "./InputBox";
import DOMPurify from "dompurify";

const ChatDays = () => {
  const { chat, isLoading } = useSelector((state: any) => state.ai);

  return (
    <>
      <ScrollArea className="h-[74vh] flex flex-col pb-2 px-4 bg-white dark:bg-gray-800">
        {isLoading ? (
          <SkeletonChat />
        ) : (
          <>
            {chat.length === 0 ? (
              <div className="flex gap-4 self-start my-4">
                <div className="bg-blue-500 self-start w-8 h-8 rounded-full text-white flex justify-center items-center">
                  <FaUserAstronaut />
                </div>
                <div className="max-w-xs p-3 rounded-lg bg-gray-300 dark:text-white text-gray-800 dark:bg-gray-700">
                  <p>Please let me know how can I help you!</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col my-4">
                {chat.map((ele: any, index: number) => (
                  <div
                    key={index}
                    className={`flex gap-4 my-4 800px:my-0 ${
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
                      <p
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(ele.parts[0].text),
                        }}
                      ></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </ScrollArea>
      <InputBox />
    </>
  );
};

export default ChatDays;
