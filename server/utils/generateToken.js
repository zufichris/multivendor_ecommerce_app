import jwt from "jsonwebtoken";
const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT);
  return token;
};
export default generateToken;
