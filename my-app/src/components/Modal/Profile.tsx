import React from "react";
import { DialogHeader, DialogDescription, DialogTitle } from "../ui/dialog";
import { useSelector } from "react-redux";
import { Avatar } from "../ui/avatar";

const Profile = () => {
  const { user } = useSelector((state: any) => state.auth);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
          Login Profile
        </DialogTitle>
        <DialogDescription className="text-gray-600 dark:text-gray-400">
          I hope you are enjoying our application!
        </DialogDescription>
      </DialogHeader>
      {user ? (
        <div className="mt-1 flex items-center space-x-4">
          <div>
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {user.name || "user email"}
            </div>
            <div className="text-gray-600 dark:text-gray-400">{user.email}</div>
          </div>
        </div>
      ) : (
        <div className="mt-4 text-gray-600 dark:text-gray-400">
          No user information available.
        </div>
      )}
    </>
  );
};

export default Profile;
