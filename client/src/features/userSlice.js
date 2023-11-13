import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getToken from "../utils/getToken";
const headers = {
  authorization: getToken(),
};
export const userApi = createApi({
  reducerPath: "user",
  tagTypes: "user",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/users",
  }),
  endpoints: (build) => ({
    allUsers: build.query({
      query: () => ({
        url: "/all-users",
        headers,
      }),
    }),
    getUser: build.query({
      query: (token) => ({
        url: `/getuserbyId`,
        method: "GET",
        headers,
      }),
    }),
    createUser: build.mutation({
      query: (user) => ({
        url: "/register",
        method: "POST",
        body: user,
        formData: true,
      }),
    }),
    logUser: build.mutation({
      query: (user) => ({
        url: "/login",
        method: "POST",
        body: user,
      }),
    }),
    getCart: build.query({
      query: () => ({ url: "/cart", method: "GET", headers }),
    }),
    getWishlist: build.query({
      query: () => ({ url: "/wishlist", method: "GET", headers }),
    }),
  }),
});
export const {
  useAllUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useLogUserMutation,
  useGetCartQuery,
  useGetWishlistQuery,
} = userApi;
