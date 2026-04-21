import { Types } from "mongoose";
import Token from "../models/Token";
import User, { IUser } from "../models/User";
import { generateToken } from "../utils/token";

class AuthService {
  static getUserByEmail = async (email: string) => {
    return await User.findOne({ email });
  };

  static getUserById = async (id: Types.ObjectId) => {
    return await User.findOne(id);
  };

  static getUserByIdWithOptions = async (
    id: Types.ObjectId,
    select: string,
  ) => {
    return await User.findOne(id).select(select);
  };

  static createUser = async (user: IUser) => {
    return await User.create(user);
  };

  static tokenExists = async (token: string) => {
    return await Token.findOne({ token });
  };

  static createToken = (id: Types.ObjectId) => {
    const token = new Token();
    token.token = generateToken();
    token.user = id;
    return token;
  };
}

export default AuthService;
