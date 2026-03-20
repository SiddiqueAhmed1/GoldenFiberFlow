import jwt from "jsonwebtoken";
export const generateAccessToken = async (userId) => {
  const token = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
    expiresIn: "5h",
  });

  return token;
};
