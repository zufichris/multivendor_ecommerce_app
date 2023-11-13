import React, { useState } from "react";
import { BsUpload } from "react-icons/bs";
import { useCreateProductMutation } from "../../features/productSlice";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const CraeteProduct = () => {
  const [create, { isLoading, isError, isSuccess }] =
    useCreateProductMutation();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await create(formData)
      .then((res) => {
        navigate("/upload-gallery", { state: { id: res?.data?._id } });
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="min-h-screen w-full py-4 flex items-center justify-center sm:bg-transparent bg-white">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="h-full w-4/5 sm:w-1/2 bg-white sm:shadow-md shadow-black flex flex-col items-center justify-between p-4 rounded-md"
      >
        <h1 className="text-blue-600 sm:text-xl font-bold my-2">
          Create a product
        </h1>
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="w-5/6 focus:border-blue-600 border-2 my-2 placeholder:text-gray-600 placeholder:font-semibold rounded-md pl-4 pr-2 focus:bg-white outline-2  focus:outline-blue-600 p-1 bg-blue-50"
        />
        <input
          type="text"
          minLength={"20"}
          name="description"
          placeholder="Description"
          required
          className="w-5/6 focus:border-blue-600 border-2 my-2 placeholder:text-gray-600 placeholder:font-semibold rounded-md pl-4 pr-2 focus:bg-white outline-2  focus:outline-blue-600 p-1 bg-blue-50"
        />
        <input
          type="number"
          min={1}
          name="price"
          placeholder="Price $"
          required
          className="w-5/6  my-2 placeholder:text-gray-600 placeholder:font-semibold rounded-md pl-4 pr-2 focus:bg-white outline-2  focus:outline-blue-600 p-1 bg-blue-50"
        />
        <select
          name="category"
          className="w-5/6 focus:border-blue-600 border-2 my-2 placeholder:text-gray-600 placeholder:font-semibold rounded-md pl-4 pr-2 focus:bg-white outline-2  focus:outline-blue-600 p-1 bg-blue-50"
        >
          <option>Category</option>
          <option value={"laptops"}>Laptops</option>
          <option value={"TVs"}>TVs</option>
          <option value={"phones"}>Phones</option>
          <option value={"games"}>Games</option>
          <option value={"headphones"}>Headphones</option>
          <option value={"accessories"}>Accessories</option>
          <option value={"animes"}>Animes</option>
        </select>
        <select
          name="brand"
          className="w-5/6 focus:border-blue-600 border-2 my-2 placeholder:text-gray-600 placeholder:font-semibold rounded-md pl-4 pr-2 focus:bg-white outline-2  focus:outline-blue-600 p-1 bg-blue-50"
        >
          <option>Brand</option>
          <option value={"hp"}>HP</option>
          <option value={"samsung"}>Samsung</option>
          <option value={"games"}>Lenovo</option>
          <option value={"headphones"}>Apple</option>
          <option value={"accessories"}>Alienware</option>
          <option value={"animes"}>Dell</option>
          <option value={"asus"}>Asus</option>
          <option value={"sony"}>Sony</option>
        </select>
        <select
          name="isFeatured"
          className="w-5/6 focus:border-blue-600 border-2 my-2 placeholder:text-gray-600 placeholder:font-semibold rounded-md pl-4 pr-2 focus:bg-white outline-2  focus:outline-blue-600 p-1 bg-blue-50"
        >
          <option>Show on product page ?</option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>

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
          {isLoading ? (
            <ClipLoader size={20} color="white" loading={isLoading} />
          ) : (
            "create"
          )}
        </button>
      </form>
    </div>
  );
};

export default CraeteProduct;
