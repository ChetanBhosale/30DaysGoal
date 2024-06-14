/* eslint-disable react-hooks/exhaustive-deps */
// InputBox.tsx
"use client";

import { Input } from "@/components/ui/input";
import React, { FormEvent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { LuSendHorizonal } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useSendMessageMutation } from "@/store/api/aiApi";
import { ReloadIcon } from "@radix-ui/react-icons";
import { setChat } from "@/store/slice/aiSlice";
import { toast } from "../ui/use-toast";

const InputBox = () => {
  const [message, setMessage] = useState("");
  const { changed, chat, day } = useSelector((state: any) => state.ai);

  const path = useParams();

  const [sendMessage, { isLoading, isError, error, isSuccess, data }] =
    useSendMessageMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const requestData = {
      day,
      text: message,
      url: path.id[0],
    };
    await sendMessage(requestData);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      const formatResponse = (text: string) => {
        return text
          .replace(/\*\*/g, "")
          .replace(/\*/g, "")
          .replace(/\n/g, "<br />");
      };

      const formattedResponse = formatResponse(data.result);

      const newData = {
        userChat: {
          role: "user",
          parts: [
            {
              text: message,
            },
          ],
        },
        modelAns: {
          role: "model",
          parts: [
            {
              text: formattedResponse,
            },
          ],
        },
      };
      dispatch(setChat(newData));
      setMessage("");
    }
    if (isError) {
      const errorData = error as any;
      toast({
        variant: "destructive",
        title: "Error",
        description: errorData.data.message,
      });
    }
  }, [isSuccess, error, isError]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full flex gap-1 border-t border-gray-300 dark:border-gray-700 p-2 bg-white dark:bg-gray-800">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        {isLoading ? (
          <>
            <ReloadIcon className="m-2 w-6 h-6 animate-spin text-gray-500" />
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              type="submit"
              className="rounded-full"
              disabled={!message.trim()}
            >
              <LuSendHorizonal size="20" className="text-gray-500" />
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default InputBox;
