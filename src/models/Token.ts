import mongoose, { Schema, Document, Types } from "mongoose";

export interface IToken extends Document {
  token: string;
  user: Types.ObjectId;
  createdAt: string;
}

const tokenSchema: Schema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: "10m", //asi el token solo durará 10 minutos y luego se eliminará
  },
});

const token = mongoose.model<IToken>("Token", tokenSchema);
export default token;
