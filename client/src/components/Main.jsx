import React from "react";
import { BsArrowClockwise } from "react-icons/bs";
import { CircleLoader } from "react-spinners";
import { useFeaturedProductsQuery } from "../features/productSlice";

const Main = () => {
  const { data, isLoading, isSuccess, isError } = useFeaturedProductsQuery();

  return (
    <div style={{ height: "90vh" }} className="w-full mt-8  flex">
      <div className="shadow-black shadow-sm p-4 w-1/5 h-full filter">
        <button></button>
      </div>
      {/* //page */}
      <div
        style={{ height: "90vh", zIndex: "100" }}
        className={`w-4/5 ${
          isSuccess ? "grid" : "flex items-center"
        }  grid-cols-2  place-content-between justify-items-center gap-2  p-4 right-0 absolute featured overflow-y-scroll`}
      >
        {isSuccess && data?.length
          ? data?.map((product) => {
              return <ProductCard key={product._id} product={product} />;
            })
          : ""}
        {isError && (
          <div className="h-full w-full flex-col flex items-center justify-center">
            <div className="text-blue-600 font-bold">Network Error</div>
            <button
              onClick={() => {
                window.location = window.location;
              }}
              className="text-white px-3 py-1 font-semibold bg-blue-600 shadow-sm shadow-black rounded-full"
            >
              <BsArrowClockwise />
            </button>
          </div>
        )}
        {isLoading && (
          <div className="flex font-light flex-col justify-center items-center gap-2 text-blue-600 w-full h-full">
            Loading Products...
            <CircleLoader
              color={"rgb(37 ,99, 235 ,1)"}
              loading={isLoading}
              size={90}
              aria-label="Loading Spinner"
              data-testid="loader"
              className="h-1"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
