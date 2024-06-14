import React from "react";

const LoadingPage = () => {
  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <span className="loader"></span>{" "}
      <h3 className="text-xl ml-4 dark:border-white border-black">
        Loading...
      </h3>
    </div>
  );
};

export default LoadingPage;
