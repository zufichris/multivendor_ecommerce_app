import React, { useState } from "react";
import { BsUpload } from "react-icons/bs";
import { ClipLoader } from "react-spinners";
import server from "../../utils/server";
import getToken from "../../utils/getToken";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const LoadProductGallery = () => {
  const navigate = useNavigate();
  const id = useLocation()?.state?.id;
  const [images, setImages] = useState([null]);
  const [limit, setLimit] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoadi] = useState(false);
  const [less, setLess] = useState(false);
  const handleChange = (e) => {
    if (images.length <= 3) {
      setImages([...images, e.target.files[0]]);
      setLimit(false);
    } else {
      setLimit(true);
    }
  };

  const upload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (images.length <= 3) {
      setLimit(true);
    } else {
      setLimit(false);
      setLoadi(true);

      formData.append("images", images[1]);
      formData.append("images", images[2]);

      await axios
        .put(`${server}/products/${id}`, formData, {
          headers: {
            authorization: getToken(),
            "content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          setLoadi(false);
          if (res?.data?.error) {
            alert("an error occured");
          }
          if (res.data.message) {
            alert("gallery updated");
            navigate("/product", { state: { id: id } });
          }
        })
        .catch((err) => {
          setLoadi(false);
          alert("an error occured");
        });
    }
  };
  return (
    <div className="flex items-center py-10 justify-center h-screen bg-white sm:bg-transparent w-screen">
      <form
        onSubmit={(e) => {
          upload(e);
        }}
        encType="multipart/form-data"
        className="w-full sm:w-1/2 px-4 py-7 h-full rounded-md sm:shadow-md shadow-black items-center justify-between bg-white flex flex-col"
      >
        <h1 className="font-bold sm:text-xl text-blue-600">
          Upload 3 images for this product gallerry
        </h1>
        <div
          onClick={() => document.querySelector(".upload").click()}
          className="border-dashed border-2 my-2 shadow-sm shadow-black h-14 border-blue-600 cursor-pointer text-blue-600 text-xs font-light flex flex-col items-center justify-center gap-1 w-1/4 rounded-md px-2 py-1"
        >
          <BsUpload size={"1.5rem"} />
          click to upload
        </div>
        <input
          name="images"
          onChange={(e) => handleChange(e)}
          type="file"
          className="hidden upload"
        />
        <div className="w-full p-2 px-6 h-40">
          {images?.length > 0 ? (
            <div className="flex bg-blue-50 items-center justify-center h-full w-full">
              {images &&
                images?.map((image, i) => {
                  return (
                    <div
                      key={i}
                      className={`${
                        image === null ? "hidden" : "h-full w-1/4 mx-2 relative"
                      } ${deleted ? "hidden" : ""} `}
                    >
                      <img
                        src={image && URL.createObjectURL(image)}
                        className="h-full w-full imgupl"
                      />
                    </div>
                  );
                })}
            </div>
          ) : (
            <div>No images chosen</div>
          )}
        </div>
        <div
          aria-disabled={images.length === 1 || loading ? true : false}
          onClick={() => {
            setImages([null]);
            setLimit(false);
          }}
          className="px-2 aria-disabled:opacity-50 cursor-pointer py-1 font-semibold text-white bg-red-600 rounded-md"
        >
          Reset
        </div>
        {limit && (
          <div className="text-red-600">You can only choose 3 images</div>
        )}
        <div
          className={`${limit ? "text-red-600" : "text-blue-600"} font-bold`}
        >
          {images.length - 1} files chosen
        </div>
        <button
          disabled={loading ? true : false}
          type="submit"
          className="px-2 disabled:bg-opacity-80 cursor-pointer py-1 font-semibold w-1/3 text-white bg-blue-600 rounded-md"
        >
          {loading || less ? (
            <ClipLoader size={20} color="white" loading={loading} />
          ) : (
            "submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default LoadProductGallery;
