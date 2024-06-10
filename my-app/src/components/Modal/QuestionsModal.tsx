"use client";

import React, { FC, useState } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
interface Props {
  onClose: () => void;
}

const QuestionsModal: FC<Props> = ({ onClose }) => {
  const [message, setMessage] = useState<{ ans: string }>({
    ans: "",
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">describe your goal</DialogTitle>
        <DialogDescription>
          Please provide a detailed description of your goal to help the AI
          generate more accurate and effective results.
        </DialogDescription>
      </DialogHeader>
      <form className="flex flex-col">
        <Textarea
          onChange={(e) => setMessage({ ans: e.target.value })}
          placeholder="Type your goal here."
          id="message"
        />
        <span className="self-end font-thin text-xs mt-1">
          {message.ans.length}/120
        </span>
      </form>
    </>
  );
};

export default QuestionsModal;
