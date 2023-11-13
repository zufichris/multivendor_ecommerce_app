import React, { useState } from "react";
import { CircleLoader } from "react-spinners";
import { useGetAllProductsQuery } from "../../features/productSlice";
import getToken from "../../utils/getToken";
import server from "../../utils/server";
import axios from "axios";
import { Link } from "react-router-dom";
import { BsPlusCircleFill } from "react-icons/bs";
const AllProducts = () => {
  const { data, isLoading, isError, isSuccess } = useGetAllProductsQuery();
  const feature = async (id, value) => {
    await axios
      .post(
        `${server}/products/set-product-feature/${id}`,
        { isFeatured: value },
        {
          headers: {
            authorization: getToken(),
          },
        }
      )
      .then((res) => {
        if (res.data.message) {
          window.location.reload();
        }
      })
      .catch((e) => {});
  };

  const deleteProduct = async (id) => {
    await axios
      .delete(`${server}/products/${id}`, {
        headers: {
          authorization: getToken(),
        },
      })
      .then((res) => {
        if (res?.data?.message) {
          window.location.reload();
        }
      })
      .catch((e) => {});
  };
  return (
    <div className="w-full h-screen relative flex flex-col items-center justify-center">
      <Link
        to="/create-product"
        className=" flex gap-1 font-semibold items-center justify-center px-4 py-2 text-white bg-blue-600 rounded-md shadow-sm shadow-black  absolute top-4 right-4 "
      >
        New Product <BsPlusCircleFill color="white" />
      </Link>
      <div
        style={{ height: "95vh" }}
        className="sm:w-1/3 w-full   rounded-md shadow-md shadow-black overflow-y-scroll overflow-x-hidden px-2 py-2 bg-white"
      >
        <div className="w-full text-center absolute top-10   left-0 right-0 text-blue-600 font-bold">
          All products
        </div>
        {isSuccess && (
          <div className="pt-14">
            {data?.length ? (
              data?.map((product) => {
                return (
                  <div
                    key={product?._id}
                    className="w-full mb-2 p-2 bg-blue-100 shadow-sm shadow-black flex-col flex items-center justify-center gap-2 rounded-md"
                  >
                    <img
                      src={product?.image}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>name:{product?.name}</div>
                    <div>price:{product?.price}$</div>
                    <div>created:{product?.createdAt?.split("T")[0]}</div>
                    {product?.isFeatured ? (
                      <div
                        onClick={(e) => feature(product?._id, false)}
                        className="w-1/3 tex-xs font-light text-center cursor-pointer  text-white bg-purple-600 px-2 rounded-md py-0.5 "
                      >
                        Remove from featured
                      </div>
                    ) : (
                      <div
                        onClick={(e) => feature(product?._id, true)}
                        className="w-1/3 tex-xs font-light text-center cursor-pointer  text-white bg-blue-600 px-2 rounded-md py-0.5 "
                      >
                        Add to featured
                      </div>
                    )}
                    <div
                      onClick={(e) => {
                        deleteProduct(product._id);
                      }}
                      className="w-1/3 text-center cursor-pointer  text-white bg-red-600 px-2 rounded-md py-0.5 font-bold"
                    >
                      Delete
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center pt-10 mt-8 text-blue-600 font-bold">
                No users
              </div>
            )}
          </div>
        )}
        {isError && (
          <div className="text-red-600 mt-14 text-center">An error occured</div>
        )}
        {isLoading && (
          <div className="w-full flex items-center justify-center pt-10 mt-10">
            <CircleLoader size={50} loading={isLoading} color="blue" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
