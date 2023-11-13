import React from "react";
import { useGetProductQuery } from "../features/productSlice";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import server from "../utils/server";
import { BsTrashFill } from "react-icons/bs";
import getToken from "../utils/getToken";
import { addToCart } from "../features/cartSlice";
import { useDispatch } from "react-redux";

const CartCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, isError, isLoading, isSuccess } = useGetProductQuery(
    product.product
  );
  const deleteFromCart = async (id) => {
    await axios
      .delete(`${server}/users/delete-from-cart/${id}`, {
        headers: {
          authorization: getToken(),
        },
      })
      .then((res) => {
        dispatch(addToCart(res.data));
        window.location.reload();
      })
      .catch((err) => {});
  };
  return (
    <div className="h-72 p-1  items-center justify-center rounded-md my-4 mx-3 relative text-blue-600 capitalize w-562 flex shadow-sm shadow-black flex-col">
      {isSuccess && (
        <>
          <div
            className="text-red-600 absolute bottom-2 right-2"
            onClick={(e) => deleteFromCart(product?.product)}
          >
            <BsTrashFill />
          </div>
          <img
            onClick={(e) => {
              navigate("/product", { state: { id: data?._id } });
            }}
            src={data?.image}
            className="h-3/4 w-60"
          />
          <div>{data?.name}</div>
          <div>number:{product?.amount}</div>
          <div>price:{product?.price}$</div>
        </>
      )}
      {isLoading && (
        <>
          <ClipLoader loading={isLoading} size={50} color="blue" />
        </>
      )}
      {isError && <div>an error occured</div>}
    </div>
  );
};

export default CartCard;
