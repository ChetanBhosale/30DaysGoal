import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@radix-ui/react-switch";
import React, { FC, useState } from "react";
import { FcGoogle } from "react-icons/fc";

type Props = {
  setPage: (num: number) => void;
};

const Login: FC<Props> = ({ setPage }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    console.log("Email:", email, "Password:", password);
  };

  const handleGoogleLogin = () => {
    // Handle the Google login logic here
    console.log("Login with Google");
  };

  return (
    <DialogContent className="sm:max-w-[500px] p-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-center">
          Login
        </DialogTitle>
        <DialogDescription className="text-center mb-4">
          Enter your email and password to log in to your account.
        </DialogDescription>
      </DialogHeader>
      <div>
        <div className="my-3 px-5 mb-5">
          <Label htmlFor="email" className="pl-2">
            Email
          </Label>
          <Input type="email" placeholder="john@gmail.com" className="mt-3" />
        </div>
        <div className="my-3 px-5 mb-2">
          <Label htmlFor="email" className="pl-2">
            Password
          </Label>
          <Input type="password" placeholder="john123" className="mt-3" />
        </div>
      </div>

      <div className="my-3 px-5 mb-5 gap-4">
        <Button className="w-full my-2">Login</Button>
        <Button variant="ghost" className="w-full my-2 flex gap-2 items-center">
          login with <FcGoogle size={20} />
        </Button>
        <p className="text-center text-sm mt-5">
          if you dont have account then{" "}
          <span
            onClick={() => setPage(2)}
            className="text-blue-400 underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </DialogContent>
  );
};

export default Login;
