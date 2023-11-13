import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsTrash, BsTrashFill, BsUpload } from "react-icons/bs";
import server from "../../utils/server";
import getToken from "../../utils/getToken";
import { ClipLoader } from "react-spinners";

const Notifications = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuc] = useState(false);
  const [err, setErr] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    setErr(false);
    setSuc(false);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await axios
      .post(`${server}/site/create-notification`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: getToken(),
        },
      })
      .then((res) => {
        if (res?.data?.message) {
          setSuc(true);
          setLoading(false);
          setTimeout(() => {
            window.location = window.location;
          }, 5);
        }
      })
      .catch((err) => {
        setErr(true);
        setLoading(false);
      });
  };
  const [notifications, setNots] = useState([]);
  const [loadingNots, setLoadingNots] = useState(false);
  const [successNots, setSucNots] = useState(false);
  const [errNots, setErrNots] = useState(false);
  const getNotifications = async () => {
    setLoadingNots(true);

    await axios
      .get(`${server}/users/notifications`, {
        headers: {
          authorization: getToken(),
        },
      })
      .then((res) => {
        setNots(res.data[0].notifications);
        setSucNots(true);
        setLoading(false);
      })
      .catch((err) => {
        setErrNots(false);
        setLoadingNots(false);
      });
  };
  const deleteNot = async (e, notification) => {
    await axios
      .delete(`${server}/site/delete-notification/${notification?._id}`)
      .then((res) => {
        window.location = window.location;
      })
      .catch((err) => {
        alert("error");
      });
  };
  useEffect(() => {
    getNotifications();
  }, []);
  return (
    <div className="flex">
      <div
        style={{ minHeight: "24rem" }}
        className="overflow-y-scroll p-2 rounded-md fixed left-20 bg-white shadow-md shadow-black m-2 w-1/3 bottom-2 top-2 flex-col flex items-center gap-2"
      >
        <h1 className="font-bold text-blue-600 mb-2">Notifications</h1>
        {successNots && (
          <div className="w-full h-full">
            {notifications?.length ? (
              notifications?.reverse()?.map((not) => {
                return (
                  <div
                    key={not?._id}
                    className="flex w-full p-2 pb-3 my-3 relative shadow-sm shadow-black rounded-md flex-col"
                  >
                    <div
                      onClick={(e, not) => deleteNot(e, not)}
                      className="absolute top-3 right-3 cursor-pointer"
                    >
                      <BsTrashFill color="red" />
                    </div>
                    <img src={not?.image} alt="not" className="h-40 w-full" />
                    <div>{not?.content}</div>
                    <div className="text-blue-600 mt-1  absolute right-1 bottom-0.5  rounded-md">
                      {not?.createdAt?.split("G")[0]}
                    </div>
                  </div>
                );
              })
            ) : (
              <div>No notifications</div>
            )}
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => send(e)}
        className="fixed right-10 w-1/3 bg-white h-96 m-2 rounded-md shadow-black shadow-md flex flex-col items-center justify-between px-2 py-4"
      >
        <h1 className="font-bold mb-2 text-blue-600">Send Notification</h1>
        {success && <div className="text-green-600">Sent🤙</div>}
        {err && <div className="text-red-600">An error occured</div>}
        <textarea
          type="text"
          minLength={15}
          maxLength={300}
          name="content"
          placeholder="Content"
          required
          className="w-5/6  focus:border-blue-600 border-2 my-2 placeholder:text-gray-600 placeholder:font-semibold rounded-md pl-4 pr-2 focus:bg-white outline-2  focus:outline-blue-600 p-1 bg-blue-50"
        ></textarea>
        <div
          onClick={() => document.querySelector(".upload").click()}
          className="border-dashed border-2 my-2 shadow-sm shadow-black h-14 border-blue-600 cursor-pointer text-blue-600 text-xs font-light flex flex-col items-center justify-center gap-1 w-1/4 rounded-md px-2 py-1"
        >
          <BsUpload size={"1.5rem"} />
          image
        </div>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          className="upload hidden"
          name="image"
        />
        {image && (
          <img
            src={URL.createObjectURL(image)}
            className="h-14 w-14 bg-white"
          />
        )}
        <button
          type="submit"
          className="w-1/3 my-2 font-semibold rounded-md text-white p-1 bg-blue-600"
        >
          {loading ? (
            <ClipLoader size={20} color="white" loading={loading} />
          ) : (
            "send"
          )}
        </button>
      </form>
    </div>
  );
};

export default Notifications;
