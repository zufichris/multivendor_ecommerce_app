import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getToken from "../utils/getToken";
const headers = {
  authorization: getToken(),
};
export const productApi = createApi({
  reducerPath: "product",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/products",
  }),
  endpoints: (build) => ({
    featuredProducts: build.query({
      query: () => ({ url: "/featured/10" }),
    }),
    getProduct: build.query({
      query: (id) => ({
        url: `/get-product/${id}`,
      }),
    }),
    getAllProducts: build.query({
      query: () => ({
        url: "/all-products",
        method: "GET",
        headers,
      }),
    }),
    createProduct: build.mutation({
      query: (product) => ({
        url: "/create-product",
        method: "POST",
        body: product,
        headers,
        formData: true,
      }),
    }),
    addToCart: build.mutation({
      query: (product) => ({
        url: `/add-to-cart/${product.productId}`,
        method: "POST",
        body: { amount: product.amount },
        headers,
      }),
    }),
    addToWishlist: build.mutation({
      query: (productId) => ({
        url: `/add-to-wishlist/${productId}`,
        method: "POST",
        headers,
      }),
    }),
    uploadGallery: build.mutation({
      query: (product) => ({
        url: `/${product.id}`,
        body: { images: product.images },
        headers,
        method: "PUT",
        formData: true,
      }),
    }),
  }),
});
export const {
  useFeaturedProductsQuery,
  useGetProductQuery,
  useGetAllProductsQuery,
  useCreateProductMutation,
  useAddToCartMutation,
  useAddToWishlistMutation,
  useUploadGalleryMutation,
} = productApi;
