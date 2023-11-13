import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import {
  BsArrowClockwise,
  BsArrowLeftSquare,
  BsBell,
  BsCart,
  BsChevronDown,
  BsChevronUp,
  BsHeartFill,
  BsList,
  BsSearch,
  BsX,
  BsXSquareFill,
} from "react-icons/bs";
import axios from "axios";
import getToken from "../utils/getToken";
import { useGetUserQuery } from "../features/userSlice";
import { useSelector } from "react-redux";
import server from "../utils/server";
import { CircleLoader, ClipLoader } from "react-spinners";
const Nav = ({ hideNav }) => {
  const cart = useSelector((state) => state.cart.amount);

  const navigate = useNavigate();
  const [openSearch, setOpen] = useState(false);
  const [openMenu, setMenu] = useState(false);
  const [openSuggestions, setOpenSuggests] = useState(false);
  const [searchInput, setSearchInput] = useState(null);
  const [searchresults, setSearchresult] = useState(null);
  //open menu
  const openMenufunc = () => {
    setOpen(false);
    setOpenSuggests(false);
    setMenu((c) => !c);
  };
  //open search
  const openSearchfunc = () => {
    setMenu(false);
    setDrop(false);
    setOpen(true);
  };
  //opensuggestions
  const openSuggestionFunc = (e) => {
    setSearchInput(e.target.value);
    if (e.target.value && openSearch) {
      setOpenSuggests(true);
    }
  };
  //search
  const [loadingSearch, setLoadSearch] = useState(false);
  const search = async () => {
    setLoadSearch(true);
    await axios
      .get(`${server}/products/search/${searchInput}`)
      .then((res) => {
        setSearchresult(res.data);
        setLoadSearch(false);
      })
      .catch((err) => {
        setLoadSearch(false);
        setSearchresult(null);
      });
  };
  //profiledrop
  const [drop, setDrop] = useState(false);
  useEffect(() => {
    search();
  }, [searchInput]);
  //logout
  const logOut = () => {
    window.localStorage.setItem("token", null);
    navigate("/signin");
  };
  //getuser
  const { data, isSuccess } = useGetUserQuery(getToken());
  //open notifi
  const [openNotif, setNotif] = useState(false);
  const [allNotifs, setAllNotifs] = useState(null);
  const [loadNotif, setLoadNotif] = useState(false);
  const [errNotif, setErrNotif] = useState(false);
  const getNotifs = async () => {
    setNotif(true);
    setErrNotif(false);
    setLoadNotif(true);
    setAllNotifs(null);
    await axios
      .get(`${server}/users/notifications`, {
        headers: {
          authorization: getToken(),
        },
      })
      .then((res) => {
        setLoadNotif(false);
        setAllNotifs(res.data[0].notifications);
      })
      .catch((err) => {
        setLoadNotif(false);
        setErrNotif(true);
      });
  };
  useEffect(() => {
    getNotifs();
    setNotif(false);
  }, []);
  return (
    <nav
      className={`${
        hideNav ? "hidden" : "flex"
      } items-center justify-between px-2 bg-white shadow-sm shadow-black py-2 sm:py-2 fixed w-full`}
    >
      <a href="/" className="h-full sm:w-1/5 w-14">
        <img src={logo} alt="logo" className="h-10   w-20" />
      </a>

      <div className={`${openSearch && "w-4/5 sm:w-1/2"}`}>
        {openSearch ? (
          <div className="w-full">
            <input
              placeholder="Search products..."
              onBlur={() => setOpen(false)}
              onChange={(e) => openSuggestionFunc(e)}
              type="search"
              className="w-3/4 outline-none placeholder:font-light placeholder:text-blue-600  rounded-s-md  pl-2 shadow-sm  shadow-black h-7"
            />
            <button
              style={{ transition: "2s" }}
              className="bg-blue-600 shadow-sm shadow-black font-semibold text-white h-7 px-3 rounded-e-md"
            >
              Go
            </button>
          </div>
        ) : (
          <div
            onClick={openSearchfunc}
            className="h-7 w-7 cursor-pointer shadow-sm shadow-black bg-blue-600 rounded-full flex items-center justify-center"
          >
            <BsSearch size={".8rem"} className="text-sm text-white" />
          </div>
        )}
      </div>
      {!openSearch && (
        <div className="font-bold text-blue-600 hidden sm:block">Deals</div>
      )}
      <a
        href="/wishlist"
        className="hidden font-bold text-blue-600 sm:flex items-center justify-center"
      >
        <BsHeartFill size={"0.75rem"} color="red" />
        wishlist
      </a>
      <a
        href="/cart"
        className={`${
          openSearch
            ? "hidden sm:flex"
            : "flex hover:text-blue-600  h-10 w-10 items-center justify-center"
        } `}
      >
        <BsCart />
        <small
          style={{ background: "red" }}
          className="flex justify-center self-start mt-1 items-center text-white rounded-full text-xs h-4 w-4"
        >
          {cart || data?.user?.cart?.cartItems?.length || 0}
        </small>
      </a>
      <div
        onClick={getNotifs}
        className={`cursor-pointer ${
          openSearch
            ? "hidden sm:flex"
            : "flex hover:text-blue-600 bell  h-10 w-10 items-center justify-center"
        }`}
      >
        <BsBell />
        <small
          style={{ background: "red" }}
          className="flex justify-center self-start mt-1 items-center text-white rounded-full text-xs  h-4 w-4"
        >
          {allNotifs?.length || 0}
        </small>
      </div>
      <div className="hidden sm:block cursor-pointer">
        {isSuccess ? (
          <div
            onClick={() => {
              setDrop((c) => !c);
              setOpen(false);
            }}
            style={{ transition: "0s" }}
            className={`flex  flex-col  right-2 w-24 shadow-sm shadow-black  items-center bg-blue-100  p-1 text-gray-800 font-semibold capitalize ${
              drop ? "absolute rounded-md top-2" : "relative rounded-full"
            }`}
          >
            <div className="flex gap-1 items-center text-xs">
              <img
                src={data?.user?.avatar}
                className="h-8 w-8    rounded-full"
              />
              <div className="styletext">
                {data?.user?.name?.substring(0, 5)}
              </div>
              <div>
                {drop ? (
                  <BsChevronUp
                    style={{ fontSize: "15px" }}
                    className="text-sm"
                  />
                ) : (
                  <BsChevronDown
                    style={{ fontSize: "15px" }}
                    className="text-sm"
                  />
                )}
              </div>
            </div>
            {data?.user?.isAdmin && (
              <a
                href="/admin-dashboard"
                className={`${drop ? "font-light text-sm" : "hidden"}`}
              >
                Admin
              </a>
            )}
            <a
              href="/profile"
              className={`${drop ? "font-light text-sm" : "hidden"}`}
            >
              profile
            </a>
            <div
              onClick={logOut}
              className={`${drop ? "flex font-light items-center" : "hidden"}`}
            >
              <BsArrowLeftSquare color="red" size={"0.8rem"} />
              logout
            </div>
          </div>
        ) : (
          <div className="flex gap-1">
            <a
              href="/signup"
              className="bg-blue-600 text-white font-semibold w-20 text-center py-1 
               rounded-full"
            >
              Signup
            </a>
            <a
              href="/signin"
              className="border-blue-600 border-2 text-blue-600 font-semibold w-20 text-center py-1  rounded-full"
            >
              Signin
            </a>
          </div>
        )}
      </div>
      <div onClick={openMenufunc} className="sm:hidden">
        <BsList className="text-xl" />
      </div>
      <menu
        className={`absolute  flex sm:hidden flex-col justify-between  py-4 items-center top-16 mt-2 bg-white h-40 w-1/3 rounded-b-md shadow-sm shadow-black ${
          openMenu ? "right-0" : "-right-60"
        }`}
      >
        {data?.user ? (
          <>
            {data?.user?.isAdmin && <a href="/admin-dashboard">Admin</a>}
            <a href="/profile">Profile</a>
            <a href="/wishlist">Wishlist</a>
            <div onClick={logOut} className="flex items-center text-red-600">
              <BsArrowLeftSquare />
              Logout
            </div>
          </>
        ) : (
          <>
            <a href="/">Home</a>
            <a href="/signin">Login</a>
            <a href="/signup">Register</a>
          </>
        )}
      </menu>

      {openNotif && (
        <div className="overflow-scroll fixed pb-14 sm:h-96   bg-blue-50 top-14 sm:w-1/3 w-full right-0  sm:right-2 shadow-lg shadow-black rounded-md p-2 flex flex-col items-center">
          <div
            onClick={() => setNotif(false)}
            className="absolute z-20 right-2 top-2"
          >
            <BsXSquareFill color="red" />
          </div>
          <h1 className="font-bold absolute w-full h-10  text-center z-10 text-blue-600 styletext top-2">
            Notifications
          </h1>

          {
            <>
              {allNotifs?.length ? (
                allNotifs?.reverse()?.map((notif, i) => {
                  return (
                    <div
                      key={i}
                      className="w-3/4 sm:my-3 mt-10 pb-6 sm:pb-2 sm:mt-14 bg-blue-50  text-gray-700 font-semibold font-sans shadow-sm shadow-black rounded-md flex flex-col py-1 px-2 relative"
                    >
                      <img
                        src={notif?.image}
                        className="h-52 rounded-b-md w-full bg-white"
                      />
                      <div className="flex justify-between w-full">
                        <div className="w-full">{notif?.content}</div>
                        <div className="text-blue-600 mt-1  absolute right-1 bottom-0.5  rounded-md">
                          {notif?.createdAt?.split("G")[0]}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="mt-10 flex text-center text-blue-600">
                  {errNotif || loadNotif ? "" : "No notification"}
                </div>
              )}
              {errNotif && (
                <div className="text-red-600 mt-10 flex flex-col gap-2 justify-center items-center">
                  <p>An error occured</p>
                  <button
                    className="px-2 py-1 bg-blue-600 rounded-full"
                    onClick={() => document.querySelector(".bell").click()}
                  >
                    <BsArrowClockwise color="white" />
                  </button>
                </div>
              )}
              {loadNotif && (
                <div className="flex text-blue-600 mt-10  flex-col gap-2 items-center justify-center">
                  <p>Loading...</p>
                  <CircleLoader size={50} loading={loadNotif} color="blue" />
                </div>
              )}
            </>
          }
        </div>
      )}
      <div
        style={{ transition: "0.5s all" }}
        className={`absolute bg-white  ${
          openSuggestions ? "top-16" : "-top-60"
        } mt-1 styletext rounded-md shadow-sm shadow-black p-2 flex flex-col items-center left-10 sm:left-48 right-10 sm:w-1/2 `}
      >
        <div className="text-xs font-bold">Suggestions</div>
        <div
          onClick={() => setOpenSuggests(false)}
          className="text-red-600 absolute h-5 w-5 text-sm right-2 top-2"
        >
          <BsX />
        </div>
        {searchresults?.length ? (
          <div className="w-full mt-4">
            {searchresults?.map((product) => {
              return (
                <div
                  onClick={(e) => {
                    navigate("/product", { state: { id: product?._id } });
                    setOpenSuggests(false);
                  }}
                  key={product?._id}
                  className="flex pr-1 cursor-pointer shadow-sm hover:shadow-blue-100 hover:text-blue-600 w-full my-0.5 justify-between text-gray-600 rounded-md items-center hover:bg-blue-50"
                >
                  <img
                    className="h-8 w-8 rounded-md"
                    src={product?.image}
                    alt={product?.name}
                  />
                  <p className="font-bold  text-xs">
                    {product?.name?.substring(0, 10)}
                    ...
                  </p>
                  <p className="text-xs text-right">
                    {product?.price}
                    <sup className="text-sm font-bold">$</sup>
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="my-2 text-sm font-bold text-blue-300">
            No results match your search
          </div>
        )}
        {loadingSearch && (
          <div className="flex flex-col pt-10 items-center justify-center gap-2 text-blue-600 font-light">
            <p>Loading results...</p>
            <ClipLoader size={20} color="blue" loading={loadingSearch} />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
