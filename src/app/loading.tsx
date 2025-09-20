import Spinner from "@/icons/spinner";
import React from "react";

function LoadingPage() {
  return (
    <div className="h-screen flex items-center flex-col gap-5 justify-center">
      <h2 className="headingFont text-2xl md:text-3xl lg:text-4xl font-bold">
        Thanks for visiting World Pumps!
      </h2>
      <Spinner className="size-9 animate-spin stroke-black" />
    </div>
  );
}

export default LoadingPage;
