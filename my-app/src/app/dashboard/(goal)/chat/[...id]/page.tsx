"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";

const ChatWithDays = () => {
  const path = useParams();
  console.log(path.query);
  return <div>page</div>;
};

export default ChatWithDays;
