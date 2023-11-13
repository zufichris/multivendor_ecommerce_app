import React from "react";
import { BsCheckCircle } from "react-icons/bs";

const CheckoutSuccess = () => {
  return (
    <div className="flex text-blue-600 h-screen w-screen flex-col gap-2 items-center justify-center font-bold text-2xl">
      <BsCheckCircle size={"2rem"} color="green" />
      CheckoutSuccess
      <a
        href="/"
        className="px-2 mt-10 text-base py-1 rounded-md bg-blue-600  text-white"
      >
        Back to home
      </a>
    </div>
  );
};

export default CheckoutSuccess;
