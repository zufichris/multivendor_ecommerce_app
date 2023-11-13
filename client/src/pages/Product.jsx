import axios from "axios";
import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import Nav from "./Nav";
import { CircleLoader, ClipLoader } from "react-spinners";
import { useAddToCartMutation } from "../features/productSlice";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";
import { BsArrowClockwise } from "react-icons/bs";
import server from "../utils/server";
import PayBtn from "../components/PayBtn";

const Product = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addToCartQuery, { isLoading, isSuccess, isError }] =
    useAddToCartMutation();
  const id = useLocation()?.state?.id;
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [number, setNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setsuccess] = useState(false);

  const getProduct = async () => {
    await axios
      .get(`${server}/products/get-product/${id}`)
      .then((res) => {
        setLoading(true);
        setProduct(res.data);
        setCurrentImage(res.data.image);
        setLoading(false);
        setsuccess(true);
      })
      .catch((err) => {
        setLoading(false);

        setError(true);
      });
  };
  const handleaddToCart = async () => {
    await addToCartQuery({ productId: product?._id, amount: number })
      .then((res) => {
        dispatch(addToCart(res.data));
      })
      .catch((err) => {
        if (
          err?.message ===
          "Cannot read properties of undefined (reading 'cartItems')"
        ) {
          navigate("/signin");
        }
      });
  };
  useEffect(() => {
    getProduct();
  }, []);
  //pay
  const cartItems = [{ product: id, amount: number }];
  return (
    <>
      <Nav />

      <section className={`pt-16 min-h-screen `}>
        {
          <>
            <div className="sm:hidden h-full sm:h-96   sm:pt-0 ">
              {success && (
                <>
                  <div className=" h-96 text-white sm:h-full flex sm:flex-col sm:w-1/3  ">
                    <div className=" w-4/5 sm:w-full">
                      <img
                        src={currentImage}
                        className="h-full w-full"
                        alt={product?.name}
                      />
                    </div>

                    {product?.images?.length && (
                      <div className="flex  flex-col sm:flex-row justify-between items-center w-1/5 sm:w-full shadow-md shadow-black">
                        {product?.images?.map((image, i) => {
                          return (
                            <img
                              key={i}
                              onClick={(e) => setCurrentImage(image)}
                              src={image}
                              className="h-24 sm:h-32 border-b-2 border-blue-100 w-full"
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div
                    style={{ minHeight: "270px" }}
                    className="bg-blue-600 pt-4   gap-4 flex flex-col items-center px-4 text-white  "
                  >
                    <div className="flex  w-full justify-between items-center text-2xl font-bold">
                      {product?.name}
                      <strong className="flex items-center text-base">
                        {product?.price}
                        <sup>$</sup>
                      </strong>
                    </div>
                    <div className="flex">
                      <div
                        onClick={() => {
                          setNum((c) => c + 1);
                        }}
                        className="h-8 w-6 text-white cursor-pointer font-bold text-xl flex items-center justify-center rounded-md bg-blue-400"
                      >
                        +
                      </div>
                      <div className="mx-2 font-bold text-xl">{number}</div>
                      <div
                        onClick={() => {
                          if (number > 1) {
                            setNum((c) => c - 1);
                          } else {
                            return;
                          }
                        }}
                        className="h-8 w-6 text-white cursor-pointer font-bold text-xl flex items-center justify-center rounded-md bg-pink-400"
                      >
                        -
                      </div>
                    </div>
                    <div className="font-light text-left text-xs flex items-center justify-center">
                      Amount to be paid:
                      <div className="font-bold text-xl text-white">
                        {product?.price * number}$
                      </div>
                    </div>
                    <p
                      style={{ minHeight: "20px", lineBreak: "anywhere" }}
                      className="pt-4 mb-14"
                    >
                      {product?.description}
                    </p>

                    <div className="fixed  w-full flex justify-between p-2 bottom-0">
                      <button
                        onClick={handleaddToCart}
                        className="cursor-pointer w-28 bg-blue-600 flex items-center justify-center py-1 px-3 rounded-full border-white border-2"
                      >
                        {isLoading ? (
                          <ClipLoader
                            color={"white"}
                            loading={isLoading}
                            size={20}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                          />
                        ) : (
                          "Add to cart"
                        )}
                      </button>
                      <PayBtn
                        cartItems={cartItems}
                        className={
                          "cursor-pointer py-1 px-3 rounded-full bg-white text-blue-600 border-white border-2"
                        }
                        text={"Buy Now"}
                      />
                    </div>
                  </div>
                </>
              )}
              {loading && (
                <div className="flex w-full mt-20 sm:mt-0 flex-col text-blue-600 items-center justify-center">
                  Loading...
                  <CircleLoader size={50} color="blue" loading={loading} />
                </div>
              )}
              {error && (
                <div className="flex w-full mt-20 sm:mt-0 flex-col gap-2 text-red-600 items-center justify-center">
                  An error Occured
                  <button
                    className="px-4 py-1 rounded-full bg-blue-600"
                    onClick={() => {
                      window.location = window.location;
                    }}
                  >
                    <BsArrowClockwise color="white" />
                  </button>
                </div>
              )}
            </div>
            <div
              style={{ height: "520px" }}
              className="hidden sm:flex bg-white justify-between  mt-4 mx-14 rounded-md shadow-black shadow-md p-4 "
            >
              {success && (
                <>
                  <div className="w-1/3 text-white h-full  flex flex-col  justify-between items-center">
                    <img src={currentImage} className="h-3/4 w-full" />
                    <div className="h-20 w-full flex ">
                      {product?.images?.length &&
                        product?.images?.map((image, i) => {
                          return (
                            <img
                              onClick={(e) => {
                                setCurrentImage(image);
                              }}
                              key={i}
                              src={image}
                              alt="gallery"
                              className="h-full w-20 rounded-md mx-1"
                            />
                          );
                        })}
                    </div>
                  </div>
                  <div className="w-1/2 h-full flex flex-col items-center justify-between">
                    <div className="flex w-full justify-around text-blue-600">
                      <div className="text-xl font-bold">{product?.name}</div>
                      <p className="text-xl font-semibold self-end">
                        {product?.price}
                        <sup className="font-bold">$</sup>
                      </p>
                    </div>
                    <div
                      className="font-light  w-4/5 text-center text-sm  "
                      style={{ lineBreak: "anywhere" }}
                    >
                      {product?.description}
                    </div>

                    <div className="flex flex-col  items-center">
                      <div className="flex">
                        <div
                          onClick={() => {
                            setNum((c) => c + 1);
                          }}
                          className="h-8 w-6 text-white cursor-pointer font-bold text-xl flex items-center justify-center rounded-md bg-blue-400"
                        >
                          +
                        </div>
                        <div className="mx-2 font-bold text-xl">{number}</div>
                        <div
                          onClick={() => {
                            if (number > 1) {
                              setNum((c) => c - 1);
                            } else {
                              return;
                            }
                          }}
                          className="h-8 w-6 text-white cursor-pointer font-bold text-xl flex items-center justify-center rounded-md bg-pink-400"
                        >
                          -
                        </div>
                      </div>
                      <div className="font-light text-xs flex items-center justify-center">
                        Amount to be paid:
                        <div className="font-bold text-xl text-blue-600">
                          {product?.price * number}$
                        </div>
                      </div>
                    </div>
                    <div className="w-full  flex justify-between">
                      <button
                        onClick={handleaddToCart}
                        className="py-2 px-4 w-40 border-2 text-center font-semibold text-blue-600 rounded-full border-blue-600"
                      >
                        {isLoading ? (
                          <ClipLoader
                            color={"blue"}
                            loading={isLoading}
                            size={20}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                          />
                        ) : (
                          "Add to cart"
                        )}
                      </button>

                      <PayBtn
                        cartItems={cartItems}
                        className={
                          "py-2 px-4 border-2 w-40 font-semibold bg-blue-600 text-white rounded-full border-blue-600"
                        }
                        text={"Buy Now"}
                      />
                    </div>
                  </div>
                </>
              )}
              {loading && (
                <div className="flex w-full flex-col text-blue-600 items-center justify-center">
                  Loading...
                  <CircleLoader size={50} color="blue" loading={loading} />
                </div>
              )}
              {error && (
                <div className="flex w-full flex-col gap-2 text-red-600 items-center justify-center">
                  An error Occured
                  <button
                    className="px-4 py-1 rounded-full bg-blue-600"
                    onClick={() => {
                      window.location = window.location;
                    }}
                  >
                    <BsArrowClockwise color="white" />
                  </button>
                </div>
              )}
            </div>
          </>
        }
      </section>
    </>
  );
};

export default Product;
