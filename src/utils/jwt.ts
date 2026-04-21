import jwt from "jsonwebtoken";
import { Types } from "mongoose";

type UserPayoload = {
  id: Types.ObjectId;
};

export const generateJWT = (payload: UserPayoload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "180d",
  });
  return token;
};
