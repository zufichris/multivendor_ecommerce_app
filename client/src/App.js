import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Register from "./pages/Register";
import Activate from "./pages/Activate";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Product from "./pages/Product";
import getToken from "./utils/getToken";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import axios from "axios";
import server from "./utils/server";
import { useGetUserQuery } from "./features/userSlice";
import Notfound from "./pages/Notfound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AllUsers from "./pages/admin/AllUsers";
import AllProducts from "./pages/admin/AllProducts";
import CraeteProduct from "./pages/admin/CraeteProduct";
import LoadProductGallery from "./pages/admin/LoadProductGallery";
import Notifications from "./pages/admin/Notifications";
import AdminProtect from "./pages/admin/AdminProtect";
import UserProtect from "./pages/admin/UserProtect";
import CheckoutSuccess from "./pages/CheckoutSuccess";

const App = () => {
  const { data } = useGetUserQuery(getToken());
  const visit = async () => {
    await axios.post(`${server}/site/increase-visits`).catch((err) => {});
  };
  useEffect(() => {
    visit();
  }, []);
  const initialOptions = {
    clientId:
      "AfOdT8LRcfhnlYLZ56yO-oFrOV5bkesj3Ur_Tuk91bXFlyq8w2hbWKqAlmVQcSoWFCt5AUPbvibNHVwi",
    currency: "USD",
    intent: "capture",
  };
  return (
    <PayPalScriptProvider options={initialOptions}>
      <section className="bg-blue-100 min-h-screen">
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Notfound />} />
            <Route index element={<Home />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify/:token" element={<Activate />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
            <Route
              path="/profile"
              element={
                <UserProtect>
                  <Profile />
                </UserProtect>
              }
            />
            //admin
            <Route
              path={"/admin-dashboard"}
              element={
                <AdminProtect>
                  <AdminDashboard />
                </AdminProtect>
              }
            />
            <Route
              path={"/admin"}
              element={
                <AdminProtect>
                  <AdminDashboard />
                </AdminProtect>
              }
            />
            <Route
              path={"/all-users"}
              element={
                <AdminProtect>
                  <AllUsers />
                </AdminProtect>
              }
            />
            <Route
              path={"/all-products"}
              element={
                <AdminProtect>
                  <AllProducts />
                </AdminProtect>
              }
            />
            <Route
              path={"/create-product"}
              element={
                <AdminProtect>
                  <CraeteProduct />
                </AdminProtect>
              }
            />
            <Route
              path={"/upload-gallery"}
              element={
                <AdminProtect>
                  <LoadProductGallery />
                </AdminProtect>
              }
            />
            <Route
              path={"/notifications"}
              element={
                <AdminProtect>
                  <Notifications />
                </AdminProtect>
              }
            />
          </Routes>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            hideProgressBar={false}
            theme="dark"
          />
        </BrowserRouter>
      </section>
    </PayPalScriptProvider>
  );
};

export default App;
