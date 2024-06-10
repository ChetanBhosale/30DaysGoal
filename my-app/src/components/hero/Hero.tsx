"use client";

import React from "react";
import { Button } from "../ui/button";
import { WiDirectionUpRight } from "react-icons/wi";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
const Hero = () => {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);

  const handleRedirection = () => {
    if (user !== null) {
      router.push("/dashboard");
      return;
    }

    toast({
      variant: "destructive",
      title: "login to get access",
    });
  };

  return (
    <div className="w-full text-center px-4 h-[80vh] flex flex-col items-center gap-5 justify-center">
      <h1 className="text-4xl 600px:text-5xl font-extrabold">
        Revolutionize Your Goal Setting with AI
      </h1>
      <p className="max-w-[50rem] text-sm 600px:text-lg ">
        SetGoals.ai leverages cutting-edge AI technology to help you set, track,
        and achieve your goals in just 30 days. Transform your aspirations into
        reality with personalized guidance and intelligent insights. Build a
        comprehensive 30-day plan and receive daily support through our
        interactive chat feature, ensuring you stay on track every step of the
        way
      </p>
      <div>
        <Button
          variant="outline"
          className="flex items-center uppercase gap-1 "
          onClick={handleRedirection}
        >
          set your first goal <WiDirectionUpRight size={25} />
        </Button>
      </div>
    </div>
  );
};

export default Hero;
