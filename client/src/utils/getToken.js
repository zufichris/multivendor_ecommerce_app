const getToken = () => {
  return `Bearer ${window.localStorage.getItem("token")}`;
};
export default getToken;
