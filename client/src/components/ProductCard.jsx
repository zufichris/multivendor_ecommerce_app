import React, { useState } from "react";
import logo from "../assets/images/logo.png";
import {
  BsCart4,
  BsCartCheck,
  BsHeart,
  BsHeartFill,
  BsStar,
  BsStarFill,
} from "react-icons/bs";
import { useDispatch } from "react-redux";
import { ClipLoader } from "react-spinners";
import {
  useAddToCartMutation,
  useAddToWishlistMutation,
} from "../features/productSlice";
import { addToCart } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addToCartQuery, { isLoading, error }] = useAddToCartMutation();
  const [addToWishQuery] = useAddToWishlistMutation();
  const [wished, setWished] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const handleaddToCart = async () => {
    await addToCartQuery({ productId: product._id, amount: 1 })
      .then((res) => {
        setAddedToCart(true);
        dispatch(addToCart(res.data));
      })
      .catch((err) => {
        setAddedToCart(false);
        if (
          err?.message ===
          "Cannot read properties of undefined (reading 'cartItems')"
        ) {
          navigate("/signin");
        }
      });
  };
  const handleAddtoWish = async () => {
    await addToWishQuery(product._id)
      .then((res) => {
        setWished((c) => !c);
      })
      .catch((err) => {});
  };
  return (
    <div className="relative rounded-md cursor-pointer overflow-hidden h-96  bg-white m-6 shadow-md shadow-black">
      <img src={logo} alt="logo" className="h-5 w-10 absolute  top-1 right-1" />
      <img
        onClick={(e) => {
          navigate("/product", { state: { id: product._id } });
        }}
        src={product?.image}
        alt={product?.name}
        className="h-2/3 w-full bg-blue-100 rounded-b-md"
      />
      <div className="flex flex-col items-center justify-between p-2 h-1/3">
        <div className="text-xl capitalize font-bold styletext text-blue-600">
          {product?.name}
        </div>
        <div className="font-light text-sm">
          {product?.description?.substring(0, 20)}...
        </div>
        <div className="flex w-full gap-2 items-center">
          <BsStarFill className="text-yellow-500" />
          <BsStarFill className="text-yellow-500" />
          <BsStarFill className="text-yellow-500" />
          <BsStarFill className="text-yellow-500" />
          <BsStar className="text-yellow-500" />
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="text-xl font-semibold text-green-600">
            {product?.price}$
          </div>
          <div onClick={handleAddtoWish} className="cursor-pointer">
            {wished ? <BsHeartFill color="red" /> : <BsHeart color="red" />}
          </div>
          <div
            onClick={handleaddToCart}
            aria-disabled={addedToCart ? true : false}
            className={`cursor-pointer h-10 w-10 ${
              !addedToCart ? "text-blue-600 " : "text-blue-600"
            }`}
          >
            {isLoading ? (
              <ClipLoader
                color={"blue"}
                loading={isLoading}
                size={10}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              <>
                {!addedToCart ? (
                  <BsCart4 size={"1.4rem"} />
                ) : (
                  <BsCartCheck color="green" size={"1.4rem"} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
