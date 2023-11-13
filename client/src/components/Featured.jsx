import React, { useEffect, useState } from "react";
import {
  BsArrowClockwise,
  BsFilter,
  BsSearch,
  BsXSquareFill,
} from "react-icons/bs";
import { useFeaturedProductsQuery } from "../features/productSlice";
import { CircleLoader } from "react-spinners";
import ProductCard from "./ProductCard";
import axios from "axios";
import server from "../utils/server";
import { useNavigate } from "react-router-dom";
const categories = [
  "Phones",
  "Laptops",
  "TVs",
  "Games",
  "Headphones",
  "Accessories",
  "Animes",
];
const brands = [
  "HP",
  "Samsung",
  "Lenovo",
  "Apple",
  "Alienware",
  "Dell",
  "Asus",

  "Sony",
];
const Featured = () => {
  const navigate = useNavigate();
  //filter
  const [filterType, setFilterType] = useState("categories");
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filterPage, setFilterPage] = useState(false);

  //
  let { data, isLoading, isError, isSuccess } = useFeaturedProductsQuery();
  const filter = async (value) => {
    setFilterPage(true);
    setLoading(true);
    if (filterType === "categories") {
      await axios
        .get(`${server}/products/filter-category/${value}`)
        .then((res) => {
          setLoading(false);
          setProducts(res.data);
        })
        .catch((err) => {
          setLoading(false);
          setError(true);
        });
    } else if (filterType === "brands") {
      await axios
        .get(`${server}/products/filter-brand/${value}`)
        .then((res) => {
          setLoading(false);
          setProducts(res.data);
        })
        .catch((err) => {
          setLoading(false);
          setError(true);
        });
    }
  };
  return (
    <section className=" min-h-screen w-screen">
      <div className={` bg-blue-50`}>
        <section className="w-full flex px-2 items-center mt-10">
          <h6 className="flex sm:w-1/4 items-center  font-bold">
            <BsFilter size={"1rem"} color="black" />
            <select
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 rounded-full py-1  bg-black text-white styletext"
            >
              <option value="categories">Categories</option>
              <option value="brands">Brands</option>
            </select>
          </h6>
          <div className="sm:w-3/4   flex sm:font-semibold text-white items-center justify-between sm:h-20 h-40 flex-wrap">
            {filterType !== "brands"
              ? categories.map((category, i) => {
                  return (
                    <div
                      onClick={(e) => filter(category.toLocaleLowerCase())}
                      key={i}
                      className="bg-blue-600 active:bg-blue-900 cursor-pointer px-3 py-1 rounded-full mx-1"
                    >
                      {category}
                    </div>
                  );
                })
              : brands.map((brand, i) => {
                  return (
                    <div
                      onClick={(e) => filter(brand.toLocaleLowerCase())}
                      key={i}
                      className="bg-blue-600 active:bg-blue-900 cursor-pointer px-3 py-1 rounded-full mx-1"
                    >
                      {brand}
                    </div>
                  );
                })}
          </div>
        </section>
        {isSuccess && (
          <div
            className={`${
              filterPage ? "hidden" : "grid"
            } min-h-screen sm:grid-cols-3 grid-cols-1 gap-4 place-content-between  bg-blue-100 py-4 px-8  sm:px-8 ${
              data?.length >= 1 ? "grid" : "block"
            }`}
          >
            {data?.length < 1 && (
              <div
                className={`${
                  isSuccess
                    ? "text-blue-600 font-light bg-white h-screen flex flex-col items-center justify-center gap-2 text-light"
                    : "hidden"
                }`}
              >
                No products found
              </div>
            )}

            {data?.length >= 1 &&
              data?.map((product) => {
                return <ProductCard key={product?._id} product={product} />;
              })}
          </div>
        )}

        {isLoading && (
          <div className="text-blue-600 font-light bg-blue-100  h-52 flex flex-col items-center justify-center gap-2 text-light">
            <p>Loading products...</p>
            <CircleLoader
              color={"rgb(37 ,99, 235 ,1)"}
              loading={isLoading}
              size={80}
              aria-label="Loading Spinner"
              data-testid="loader"
              className="h-1"
            />
          </div>
        )}
        {isError && (
          <div className="text-red-600 bg-blue-100 h-40 flex flex-col items-center  justify-center gap-2 text-light">
            <p>An error occured</p>
            <button
              onClick={() => {
                navigate("/");
              }}
              className="bg-blue-600 refresh px-4 py-1 rounded-full"
            >
              <BsArrowClockwise color="white" />
            </button>
          </div>
        )}
      </div>

      {filterPage && (
        <div
          className={`${
            isError ? "hidden" : "block"
          } relative min-h-screen grid grid-cols-1 gap-4 pt-10 pb-10 px-5 sm:px-4 sm:grid-cols-3 w-full bg-transparent`}
        >
          <>
            {products?.length ? (
              products?.reverse()?.map((product) => {
                return <ProductCard key={product?._id} product={product} />;
              })
            ) : (
              <div
                className={`${error ? "hidden" : "block"} ${
                  loading ? "hidden" : "block"
                } h-1/2 w-screen font-bold text-blue-600  flex items-center justify-center styletext`}
              >
                No products
              </div>
            )}
          </>

          <div className="h-1/2 text-blue-600 font-light  w-screen flex flex-col items-center justify-center">
            {loading && (
              <>
                <div>Loading...</div>
                <CircleLoader size={50} color="blue" loading={loading} />
              </>
            )}

            {error && (
              <div className={` text-red-600 w-full text-center`}>
                An error occured
              </div>
            )}
            <div
              onClick={() => setFilterPage(false)}
              className="absolute cursor-pointer top-2 right-4"
            >
              <BsXSquareFill className="text-red-600" size={"1.5rem"} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Featured;
