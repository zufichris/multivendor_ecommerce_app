import React from "react";
import { useGetUserQuery } from "../../features/userSlice";
import NotFound from "../../pages/Notfound";
import { CircleLoader } from "react-spinners";
const AdminProtect = ({ children }) => {
  const { data, isLoading, isSuccess, isError } = useGetUserQuery();
  return (
    <>
      {isSuccess && <>{data?.user?.isAdmin ? children : <NotFound />}</>}
      {isLoading && (
        <div>
          <CircleLoader size={50} loading={isLoading} color="blue" />
        </div>
      )}
      {isError && <NotFound />}
    </>
  );
};

export default AdminProtect;
