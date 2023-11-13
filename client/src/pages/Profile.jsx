import React, { useState } from "react";
import Nav from "./Nav";
import { useGetUserQuery } from "../features/userSlice";
import getToken from "../utils/getToken";
import axios from "axios";
import server from "../utils/server";
import { useNavigate } from "react-router-dom";
import { BsArrowClockwise } from "react-icons/bs";
import { CircleLoader } from "react-spinners";
const Profile = () => {
  const { data, isLoading, isSuccess, isError } = useGetUserQuery(getToken());
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleDelete = async () => {
    await axios
      .delete(`${server}/users/delete-user/${password}`, {
        headers: {
          authorization: getToken(),
        },
      })
      .then((res) => {
        if (res?.data?.message === "account deleted") {
          window.localStorage.setItem("token", null);
          navigate("/signin");
          alert("account deleted");
        } else {
          setError(true);
          setMessage(res?.data?.message);
        }
      })
      .catch((err) => {
        if (password === "" || password === null) {
          setMessage("incorrect password");
          setError(true);
        } else {
          setMessage("server currently down");
        }
      });
  };
  return (
    <>
      <Nav />
      <div className=" w-full  pt-20  sm:bg-transparent  flex sm:justify-center items-center">
        <div className="sm:w-1/3 w-full pb-4 bg-transparent sm:shadow-md shadow-black sm:bg-white p-2 gap-4 flex-col flex  items-start ">
          <h1 className="w-full text-xl font-bold text-center">Profile</h1>
          {isSuccess && (
            <>
              <img
                src={data?.user?.avatar}
                className="h-20 w-20 bg-white self-center  rounded-full"
                alt={data?.user?.name}
              />
              <div className="flex  justify-center gap-2 text-blue-600">
                <p className="text-black text-semibold">Name:</p>
                {data?.user?.name}
              </div>
              <div className="flex  justify-center gap-2 text-blue-600">
                <p className="text-black text-semibold">Email:</p>
                {data?.user?.email}
              </div>
              <div className="flex  justify-center gap-2 text-blue-600">
                <p className="text-black text-semibold">Created:</p>
                {data?.user?.createdAt?.split("T")[0]}
              </div>
              {data?.user?.isAdmin && (
                <a
                  href="/admin-dashboard"
                  className="px-4 self-center py-1 bg-blue-600 rounded-lg text-white font-semibold"
                >
                  Admin Dashboard
                </a>
              )}
              {!show && (
                <button
                  onClick={() => setShow(true)}
                  className="px-4 self-center py-1 bg-red-600 rounded-lg text-white font-semibold"
                >
                  Delete Account
                </button>
              )}
              {show && (
                <div className="w-full flex flex-col items-center gap-2">
                  <p className="text-sm text-red-600 font-light text-center">
                    {message}
                  </p>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Enter your password"
                    className={`${
                      error ? "border-red-600" : ""
                    } w-3/4 border-2 py-1 px-1 placeholder:font-semibold focus:border-blue-600 bg-blue-100 focus:bg-white rounded-md`}
                  />
                  <button
                    onClick={handleDelete}
                    className="px-4 py-1 bg-red-600 rounded-lg text-white font-semibold"
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
          {isError && (
            <div className="mt-10 flex flex-col items-center gap-2  self-center justify-center">
              <p className="font-semibold text-red-600">An error occured</p>
              <button
                onClick={() => {
                  window.location = window.location;
                }}
                className="px-2 py-1 rounded-full bg-blue-600 text-white"
              >
                <BsArrowClockwise />
              </button>
            </div>
          )}
          {isLoading && (
            <div className="mt-10 flex flex-col items-center gap-2  self-center justify-center">
              <p className=" text-blue-600">Loading...</p>
              <CircleLoader size={50} loading={isLoading} color="blue" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
