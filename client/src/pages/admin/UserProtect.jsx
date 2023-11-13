import React from "react";
import { useGetUserQuery } from "../../features/userSlice";
import NotFound from "../../pages/Notfound";
import { CircleLoader } from "react-spinners";
const UserProtect = ({ children }) => {
  const { data, isLoading, isSuccess, isError } = useGetUserQuery();
  return (
    <>
      {isSuccess && <>{data?.user ? children : <NotFound />}</>}
      {isLoading && (
        <div>
          <CircleLoader size={50} loading={isLoading} color="blue" />
        </div>
      )}
      {isError && <NotFound />}
    </>
  );
};

export default UserProtect;
