import axios from "axios";
import React, { useState } from "react";
import server from "../utils/server";
import getToken from "../utils/getToken";
import { ClipLoader } from "react-spinners";
import { PayPalButtons } from "@paypal/react-paypal-js";

const PayBtn = ({ cartItems, className, text }) => {
  const [loading, setLoading] = useState(false);
  const checkout = async () => {
    setLoading(true);
    await axios
      .post(`${server}/stripe/create-checkout-session`, cartItems, {
        headers: {
          authorization: getToken(),
        },
      })
      .then((res) => {
        if (res.data.url) {
          window.location.href = res.data.url;
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  return (
    <>
      <button onClick={() => checkout()} className={`${className}`}>
        {loading ? (
          <ClipLoader size={20} loading={loading} color="blue" />
        ) : (
          text
        )}
      </button>
    </>
  );
};

export default PayBtn;
