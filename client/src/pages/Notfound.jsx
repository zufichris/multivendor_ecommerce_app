import React from "react";
import logo from "../assets/images/logo.png";
const Notfound = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full flex-col">
      <img src={logo} alt="iqtech" />
      <div className="animate-pulse">
        <div className="text-5xl font-black">404</div>
        <p className="font-bold text-xl">Not Found</p>
      </div>
      <a
        href="/"
        className="mt-10 animate-bounce px-4 py-2 font-bold text-white bg-blue-600 rounded-md shadow-md shadow-black"
      >
        Back to home
      </a>
    </div>
  );
};

export default Notfound;
