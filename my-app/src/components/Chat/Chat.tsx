/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, FormEventHandler, useEffect, useState } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { useSubmitAnswersMutation } from "@/store/api/aiApi";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

interface Props {
  path: string;
  chat: any;
  setChat: (data: any) => void;
}

const Chat: FC<Props> = ({ path, chat, setChat }) => {
  const [type, setType] = useState({
    ans: "",
  });

  const [submitAnswers, { isSuccess, isLoading, isError, error, data }] =
    useSubmitAnswersMutation();

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const mainData = {
      body: type,
      url: path,
    };

    if (type.ans.length == 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Answer could not be empty",
      });
      return;
    }
    await submitAnswers(mainData);
  };

  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      console.log(data);

      if (data.text.includes("plan generated successfully")) {
        toast({
          title: "Plan generated successfully!",
        });
        window.location.reload();
      }

      const userData = {
        role: "user",
        parts: [{ text: type.ans }],
      };
      const modelData = {
        role: "model",
        parts: [{ text: data.text }],
      };
      setChat([...chat, userData, modelData]);
      setType({ ans: "" });
    }
    if (isError) {
      const errorData = error as any;

      if (errorData.data.message.includes("GOOGLE")) {
        toast({
          variant: "destructive",
          title: "ERROR",
          description: "Model is facing some server issues",
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }

      toast({
        variant: "destructive",
        title: "ERROR",
        description: errorData.data.message,
      });
    }
  }, [isSuccess, isError]);

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bottom-0 w-full flex gap-2 p-3 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700"
    >
      <Input
        placeholder="Type here..."
        value={type.ans}
        className="flex-1 rounded-none border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        onChange={(e) => setType({ ans: e.target.value })}
      />
      {isLoading ? (
        <ReloadIcon className="m-2 w-6 h-6 animate-spin text-gray-500" />
      ) : (
        <Button
          variant="ghost"
          size="sm"
          disabled={isLoading}
          type="submit"
          className="rounded-none"
        >
          <LuSendHorizonal size="20" className="text-gray-500" />
        </Button>
      )}
    </form>
  );
};

export default Chat;
