import React, { useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { ClipLoader } from "react-spinners";
import { useCreateUserMutation } from "../features/userSlice";
import { BsArrowClockwise, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
const Register = () => {
  const navigate = useNavigate();
  const [addUser, { isLoading, isError, isSuccess }] = useCreateUserMutation();
  const [name, setName] = useState("");
  const [validateName, setValName] = useState(true);
  const [validatePassword, setValPass] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.length < 5) {
      setValName(false);
    } else {
      setValName(true);
    }
    if (password.length < 6) {
      setValPass(false);
    } else {
      setValPass(true);
    }
    const formData = new FormData(e.currentTarget);

    if (validateName && validatePassword) {
      await addUser(formData).then((res) => {
        if (res?.error) {
          if (res.error?.error === "TypeError: Failed to fetch")
            setErmessage("Server currently shutdown");
        }
        if (res.error?.status === "PARSING_ERROR")
          setErmessage("please input all fields");
        if (
          res.error?.error ===
          "User with this email already exist Please login to continue"
        )
          setErmessage(
            "User with this email already exist Please login to continue"
          );
      });
    }
  };
  const [errMessage, setErmessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };
  const nameChange = (e) => {
    setName(e.target.value);
  };
  isSuccess && navigate("/verify/verify-account", { state: { name, email } });
  return (
    <div className="min-h-screen w-full sm:bg-transparent bg-white sm:flex items-center justify-center ">
      <form
        className="h-4/5 my-10  w-full sm:h-5/6 gap-4 mb-4 sm:mb-0 sm:w-1/3 sm:rounded-md sm:shadow-md shadow-gray-600 bg-white flex flex-col justify-between py-10 sm:py-6 items-center p-8"
        encType="multipart/form-data"
        onSubmit={(e) => handleSubmit(e)}
      >
        <img src={logo} className="h-10 w-1/2" />
        <div className="flex flex-col items-center font-light">
          <div className="text-2xl font-bold">Signup</div>
          <p>
            or
            <a href="/signin" className="text-blue-600 font-normal mx-1">
              login
            </a>
            to start shopping
          </p>
        </div>
        {isError && (
          <div className="my-2 text-red-600 font-light text-xs">
            {validateName && validatePassword && errMessage}
          </div>
        )}
        <div className="w-5/6 relative flex flex-col gap-1 items-center justify-center">
          <p
            className={`${
              !validateName ? "text-xs font-light text-red-600" : "hidden"
            }`}
          >
            try another username
          </p>
          <input
            required
            className={`w-full ${
              !validateName ? "border-red-600 border-2" : "border-none"
            } placeholder:text-gray-600 placeholder:font-semibold rounded-md pl-4 pr-2 focus:bg-white outline-2  focus:outline-blue-600 p-1 bg-blue-50`}
            onChange={(e) => nameChange(e)}
            type="text"
            name="name"
            placeholder="username"
          />
        </div>
        <input
          required
          className="w-5/6  placeholder:text-gray-600 placeholder:font-semibold rounded-md pl-4 pr-2 focus:bg-white outline-2  focus:outline-blue-600 p-1 bg-blue-50"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
          placeholder="email"
          autoComplete="email"
        />
        <div className="w-5/6 relative flex flex-col items-center justify-center">
          <p
            className={`${
              !validatePassword
                ? "text-xs absolute -top-5 font-light text-red-600"
                : "hidden"
            }`}
          >
            password is too short
          </p>
          <div
            onClick={() => setShow((c) => !c)}
            className="absolute cursor-pointer right-2 "
          >
            {show ? (
              <BsEyeSlashFill className="text-blue-600" />
            ) : (
              <BsEyeFill className="text-blue-600" />
            )}
          </div>
          <input
            required
            className={`w-full ${
              !validatePassword ? "border-red-600 border-2" : "border-none"
            } placeholder:text-gray-600 placeholder:font-semibold rounded-md pl-4 pr-2 focus:bg-white outline-2  focus:outline-blue-600 p-1 bg-blue-50`}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            name="password"
            placeholder="password"
          />
        </div>
        <div className="flex items-center flex-col justify-center gap-2">
          <p className="text-xs font-semibold">
            Chose a picture for your profile
          </p>
          <div className="flex items-center ml-4">
            {avatar ? (
              <img
                onClick={() => document.querySelector(".file").click()}
                src={URL.createObjectURL(avatar)}
                alt="current-picture"
                className="h-16 w-16 rounded-full cursor-pointer"
              />
            ) : (
              <RxAvatar
                onClick={() => document.querySelector(".file").click()}
                className="h-14  w-14 cursor-pointer rounded-full text-blue-600"
              />
            )}

            <input
              hidden
              className="file"
              type="file"
              name="avatar"
              accept="image/*"
              onChange={(e) => handleFileChange(e)}
            />
          </div>
        </div>

        <button
          className="bg-blue-600 disabled:cursor-not-allowed flex items-center justify-center disabled:opacity-50 font-semibold text-white p-1 w-1/4 rounded-md"
          type="submit"
        >
          {isLoading ? (
            <ClipLoader
              color={"white"}
              loading={isLoading}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            "submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default Register;
