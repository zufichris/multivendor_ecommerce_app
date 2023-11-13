import React, { useEffect, useState } from "react";
import {
  BsArrowClockwise,
  BsBellFill,
  BsCurrencyDollar,
  BsEyeFill,
  BsLaptopFill,
  BsPlusCircleFill,
} from "react-icons/bs";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import getToken from "../../utils/getToken";
import server from "../../utils/server";
import { CircleLoader } from "react-spinners";
import { Link } from "react-router-dom";
const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const getdata = async () => {
    setLoading(true);
    await axios
      .get(`${server}/site/site-data`, {
        headers: {
          authorization: getToken(),
        },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setErr(true);
        console.log(err);
      });
  };
  useEffect(() => {
    getdata();
  }, []);
  return (
    <div className="h-screen w-full sm:bg-transparent bg-white p-16 px-20">
      {data && (
        <div className="h-full px-4 pt-10 pb-4 relative text-white w-full    bg-white sm:shadow-md shadow-black flex flex-wrap justify-between items-center rounded-md">
          <h1 className="absolute w-full text-blue-600  font-bold self-start top-2 text-center">
            Dashboard
          </h1>
          <div
            style={{ width: "20%", height: "45%" }}
            className=" rounded-md shadow-inner p-2 shadow-orange-950   bg-orange-600 flex justify-between items-center flex-col"
          >
            <h2 className=" styletext font-bold self-start">Site visits</h2>
            <BsEyeFill size={"1.5rem"} />
            <div className="text-xl font-black w-full text-center">
              {data?.visits}
            </div>
          </div>
          <a
            href="/notifications"
            style={{ width: "20%", height: "45%" }}
            className=" rounded-md shadow-inner p-2 shadow-blue-950   bg-blue-600 flex justify-between items-center flex-col"
          >
            <h2 className=" styletext font-bold self-start">Notifications</h2>
            <BsBellFill size={"1.5rem"} />
            <div className="text-xl font-black w-full text-center">
              {data?.notifications}
              <div className=" flex gap-1 font-normal text-sm items-center justify-center">
                New Notifications <BsPlusCircleFill color="white" />
              </div>
            </div>
          </a>
          <a
            href="/all-users"
            style={{ width: "48%", height: "45%" }}
            className=" rounded-md shadow-inner p-2 shadow-cyan-950 flex justify-between items-center flex-col  bg-cyan-600"
          >
            <h2 className=" styletext font-bold self-start">
              Registered customers
            </h2>
            <RxAvatar size={"2.5rem"} />
            <div className="text-xl font-black w-full text-center">
              {data?.users}
            </div>
          </a>
          <a
            href="/all-products"
            style={{ width: "48%", height: "45%" }}
            className=" rounded-md shadow-inner p-2 shadow-purple-950 flex justify-between items-center flex-col  bg-purple-600"
          >
            <h2 className=" styletext font-bold self-start">All products</h2>
            <BsLaptopFill size={"1.5rem"} />
            <div className="text-xl font-black w-full text-center">
              {data?.products}
            </div>
          </a>
          <a
            href="/all-orders"
            style={{ width: "48%", height: "45%" }}
            className=" rounded-md shadow-inner p-2 shadow-pink-950  bg-pink-600"
          >
            <h2 className=" styletext font-bold self-start">All Orders</h2>
            <BsCurrencyDollar size={"1.5rem"} />
          </a>
        </div>
      )}
      {err && (
        <div className="h-full relative text-red-600 w-full    bg-white sm:shadow-md shadow-black  rounded-md  flex items-center justify-center flex-col gap-2">
          <div>An error occured</div>
          <button
            className="text-white bg-blue-600 px-2 py-1 rounded-full"
            onClick={() => {
              window.location = window.location;
            }}
          >
            <BsArrowClockwise color="white" />
          </button>
        </div>
      )}
      {loading && (
        <div className="h-full relative text-blue-600 w-full    bg-white sm:shadow-md shadow-black  rounded-md  flex items-center justify-center flex-col gap-2">
          <div>Loading...</div>
          <CircleLoader size={50} loading={loading} color="blue" />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
