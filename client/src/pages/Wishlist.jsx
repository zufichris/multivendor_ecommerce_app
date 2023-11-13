import React from "react";
import { useGetWishlistQuery } from "../features/userSlice";
import ProductCard from "../components/ProductCard";
import Nav from "../pages/Nav";
const Wishlist = () => {
  const { data } = useGetWishlistQuery();

  return (
    <>
      <Nav />
      <div className="grid grid-cols-3 pt-20">
        {data?.wishlist?.length &&
          data?.wishlist?.map((product) => {
            return <ProductCard key={product._id} product={product} />;
          })}
      </div>
    </>
  );
};

export default Wishlist;
