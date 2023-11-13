import React from "react";
import Nav from "./Nav";

import { useGetCartQuery } from "../features/userSlice";
import CartCard from "../components/CartCard";
import { useSelector } from "react-redux";
import { CircleLoader } from "react-spinners";
import PayBtn from "../components/PayBtn";

const Cart = () => {
  const { data, isLoading, isSuccess, isError } = useGetCartQuery();
  const { totalAmount, totalPrice } = useSelector((state) => state.cart);
  return (
    <section>
      <Nav />
      {
        <div
          className={`${isLoading ? "opacity-20" : ""} w-full pt-20  bg-white`}
        >
          <div className="sm:w-2/3   min-h-screen pb-28 overflow-y-scroll  sm:mb-9 flex flex-col sm:grid grid-cols-3 items-center justify-around">
            {data?.cartItems?.length ? (
              data?.cartItems?.map((item, i) => {
                return <CartCard product={item} key={i} />;
              })
            ) : (
              <div className="w-screen  h-screen flex flex-col items-center justify-center">
                <p className="text-blue-600 font-bold py-4">No items in cart</p>
                <div className="w-full flex justify-center items-center gap-4">
                  <a
                    href="/"
                    className="px-4 w-40 py-2 text-center bg-blue-600 font-bold shadow-md shadow-black rounded-full text-white"
                  >
                    Start shopping
                  </a>
                  <a
                    href="/signin"
                    className="px-4 w-40 rounded-full text-blue-600  py-2 border-2 text-center  border-blue-600 font-bold shadow-md shadow-black"
                  >
                    Signin
                  </a>
                </div>
              </div>
            )}
          </div>
          {data?.cartItems?.length && (
            <div className="w-full sm:w-1/3 fixed flex py-2 items-start  gap-1 flex-col  bg-blue-600  text-xl font-bold bottom-0 sm:top-0 sm:right-0 sm:items-center sm:justify-center">
              <p className="flex justify-center  gap-1">
                Total Amount:
                <strong className="text-cyan-300 text-2xl font-bold">
                  {totalAmount || data?.totalAmount || 0}
                </strong>
              </p>
              <p className="flex  justify-center gap-1">
                Total Price:
                <strong className="text-cyan-300 text-2xl font-bold">
                  {totalAmount || data?.totalPrice || 0}$
                </strong>
              </p>

              <PayBtn
                cartItems={data?.cartItems}
                text={"Pay Now"}
                className={
                  "bg-white px-5 py-2 rounded-full font-bold text-blue-600 self-center"
                }
              />
            </div>
          )}
        </div>
      }
      {isLoading && (
        <div
          style={{ zIndex: 500 }}
          className="fixed flex items-center justify-center  bg-transparent top-0 left-0 right-0 bottom-0"
        >
          <div className="flex flex-col gap-2 font-light text-blue-600">
            <p>Loading...</p>
            <CircleLoader size={80} loading={isLoading} color="blue" />
          </div>
        </div>
      )}
    </section>
  );
};

export default Cart;
