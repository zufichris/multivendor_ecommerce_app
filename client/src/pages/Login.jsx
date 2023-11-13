import React, { useEffect, useState } from "react";
import { useLogUserMutation } from "../features/userSlice";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import logo from "../assets/images/logo.png";
const Login = () => {
  const [logUser, { isLoading }] = useLogUserMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await logUser({ email, password });
    if (error && error?.status === 400) {
      setMessage("An error occured");
    } else {
      setMessage("Server currently down...");
    }

    if (data?.success) {
      window.localStorage.setItem("token", data?.token);
      navigate("/");
    }
  };

  return (
    <div className="h-screen w-full sm:flex items-center justify-center ">
      <form
        className="h-full w-full sm:h-5/6 sm:w-1/3 rounded-md shadow-md shadow-gray-600 bg-white flex flex-col justify-ceneter gap-6 sm:pt-20 pt-32 items-center p-8"
        onSubmit={(e) => handleSubmit(e)}
      >
        <img src={logo} className="h-10 w-1/2" />
        <div className="flex flex-col items-center font-light">
          <div className="text-2xl font-bold">Signin</div>
          <p>
            or
            <a href="/signup" className="text-blue-600 font-normal mx-1">
              create account
            </a>
            to start shopping
          </p>
        </div>
        <div className="font-light text-red-600">{message}</div>
        <input
          required
          className="w-5/6 placeholder:text-gray-600 placeholder:font-semibold rounded-md pl-4 focus:border-blue-600 border-2 pr-2 focus:bg-white outline-2  focus:outline-blue-600 p-1 bg-blue-50"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          placeholder="email"
          autoComplete="email"
        />
        <div className="w-5/6 relative flex items-center justify-center">
          <div
            onClick={() => setShow((c) => !c)}
            className="absolute cursor-pointer right-2"
          >
            {show ? (
              <BsEyeSlashFill className="text-blue-600" />
            ) : (
              <BsEyeFill className="text-blue-600" />
            )}
          </div>
          <input
            required
            className="w-full placeholder:text-gray-600 placeholder:font-semibold rounded-md pl-2 pr-7 focus:bg-white focus:border-blue-600 border-2 outline-2  focus:outline-blue-600 p-1 bg-blue-50"
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            name="password"
            placeholder="password"
          />
        </div>
        <button
          className="bg-blue-600 font-semibold text-white p-1 w-1/4 rounded-md"
          type="submit"
        >
          {isLoading ? (
            <ClipLoader color="white" loading={isLoading} size={20} />
          ) : (
            "submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
