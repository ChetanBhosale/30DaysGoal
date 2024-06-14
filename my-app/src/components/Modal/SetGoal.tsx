"use client";

import React, { EventHandler, FC, FormEvent, useEffect, useState } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";
import { useGetGoalsQuery, useSetGoalMutation } from "@/store/api/aiApi";
import { ReloadIcon } from "@radix-ui/react-icons";
interface Props {
  onClose: () => void;
}

const SetGoal: FC<Props> = ({ onClose }) => {
  const [message, setMessage] = useState<{ ans: string }>({
    ans: "",
  });

  const [setGoal, { isLoading, data, isSuccess, isError, error }] =
    useSetGoalMutation();

  const { refetch } = useGetGoalsQuery({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // onClose();

    if (message.ans.length < 30) {
      toast({
        title: "Error",
        description: "please provide atleast 30 characters of input!",
      });
      return;
    } else if (message.ans.length >= 120) {
      toast({
        title: "Error",
        description: "please provide input characters less than 120",
      });
      return;
    }
    await setGoal({ ans: message.ans });
    refetch();
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success",
        description: data.message,
      });
      onClose();
    }
    if (isError) {
      if (error) {
        const errorData = error as any;
        console.log(errorData);
        toast({
          title: "Error",
          description: errorData.data.message,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, isSuccess, error]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">describe your goal</DialogTitle>
        <DialogDescription>
          Please provide a detailed description of your goal to help the AI
          generate more accurate and effective results.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <Textarea
          onChange={(e) => setMessage({ ans: e.target.value })}
          placeholder="Type your goal here."
          id="message"
        />
        <span className="self-end font-thin text-xs mt-1">
          {message.ans.length}/120
        </span>

        {isLoading ? (
          <>
            {" "}
            <Button disabled className="mt-4 w-full flex gap-4">
              <ReloadIcon className=" animate-spin" />
              Generating Goal
            </Button>
          </>
        ) : (
          <>
            <Button type="submit" className="mt-4 w-full">
              Generate Result
            </Button>
          </>
        )}
      </form>
    </>
  );
};

export default SetGoal;
