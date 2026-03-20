import jwt from "jsonwebtoken";
const generateRefreshToken = async (userId) => {
  const token = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  return token;
};

export default generateRefreshToken;
