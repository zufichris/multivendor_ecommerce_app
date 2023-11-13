import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircleLoader, PropagateLoader } from "react-spinners";
import {
  BsCheckCircle,
  BsEnvelope,
  BsMailbox,
  BsMailbox2,
} from "react-icons/bs";
import { useLocation, useParams } from "react-router-dom";
import server from "../utils/server";
const Activate = () => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const location = useLocation();
  const verify = async () => {
    if (!params.token.includes("verify")) {
      setLoading(true);
      await axios
        .get(`${server}/users/verify/${params.token}`)

        .then((res) => {
          setSuccess(true);
          setLoading(false);
          window.localStorage.setItem("token", params.token);
        })
        .catch((err) => setLoading(false));
    }
  };
  useEffect(() => {
    verify();
  }, []);

  return (
    <>
      {
        <div
          className={`${
            loading
              ? "absolute h-screen w-screen flex items-center justify-center bg-blue-100"
              : "hidden"
          }`}
        >
          <CircleLoader
            color={"rgb(37 ,99, 235 ,1)"}
            loading={loading}
            size={80}
            aria-label="Loading Spinner"
            data-testid="loader"
            className="h-1"
          />
        </div>
      }
      {success ? (
        <div className="flex flex-col justify-center items-center gap-4 h-screen">
          <h1 className="font-light text-xl">
            your account has been successfully verified
          </h1>

          <BsCheckCircle size={"5rem"} color="green" />
          <a
            href="/"
            className="p-2 bg-blue-600  rounded-full  font-semibold text-white shadow-black shadow-sm"
          >
            start shopping
          </a>
        </div>
      ) : (
        <div
          className={`${
            loading ? "blur-sm opacity-40" : ""
          } flex items-center justify-center gap-4 flex-col h-screen`}
        >
          <h1 className="text-xl font-bold">
            Dear {location?.state && location?.state?.name}
          </h1>
          <BsEnvelope size={"3rem"} className="text-black" />
          <div className="text-black flex gap-1 text-sm font-light">
            check your email:
            <p className="font-bold text-blue-600">
              {location?.state && location?.state?.email}
            </p>
            to verify your account
          </div>
        </div>
      )}
    </>
  );
};

export default Activate;
