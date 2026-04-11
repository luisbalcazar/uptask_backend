import { Types } from "mongoose";
import Token from "../models/Token";
import User, { IUser } from "../models/User";

class AuthService {
  static getUserByEmail = async (email: string) => {
    return await User.findOne({ email });
  };

  static getUserById = async (id: Types.ObjectId) => {
    return await User.findOne(id);
  };

  static createUser = async (user: IUser) => {
    return await User.create(user);
  };

  static tokenExists = async (token: string) => {
    return await Token.findOne({ token });
  };
}

export default AuthService;
