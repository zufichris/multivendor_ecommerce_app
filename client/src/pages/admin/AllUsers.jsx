import React, { useEffect, useState } from "react";
import { useAllUsersQuery } from "../../features/userSlice";
import { CircleLoader } from "react-spinners";

const AllUsers = () => {
  const { data, isLoading, isError, isSuccess } = useAllUsersQuery();

  const [blocked, setBlocked] = useState(data?.blocked);
  return (
    <div className="w-full h-screen relative flex flex-col items-center justify-center">
      <div
        style={{ height: "95vh" }}
        className="sm:w-1/3 w-full   rounded-md shadow-md shadow-black overflow-y-scroll overflow-x-hidden px-2 py-2 bg-white"
      >
        <div className="w-full text-center absolute top-10   left-0 right-0 text-blue-600 font-bold">
          All users
        </div>
        {isSuccess && (
          <div className="pt-14">
            {data?.length ? (
              data?.map((user) => {
                return (
                  <div
                    key={user?._id}
                    className="w-full mb-2 p-2 bg-blue-100 shadow-sm shadow-black flex-col flex items-center justify-center gap-2 rounded-md"
                  >
                    <img
                      src={user?.avatar}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>name:{user?.name}</div>
                    <div>email:{user?.email}</div>
                    <div>created:{user?.createdAt?.split("T")[0]}</div>
                    {!blocked ? (
                      <div className="w-1/3 text-center cursor-pointer  text-white bg-red-600 px-2 rounded-md py-0.5 font-bold">
                        Block
                      </div>
                    ) : (
                      <div className="w-1/3 text-center cursor-pointer text-white bg-blue-600 px-2 rounded-md py-0.5 font-bold">
                        Unblock
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center pt-10 mt-8 text-blue-600 font-bold">
                No users
              </div>
            )}
          </div>
        )}
        {isError && (
          <div className="text-red-600 mt-14 text-center">An error occured</div>
        )}
        {isLoading && (
          <div className="w-full flex items-center justify-center pt-10 mt-10">
            <CircleLoader size={50} loading={isLoading} color="blue" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
