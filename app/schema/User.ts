import mongoose from "mongoose";
import { type BaseSchema } from "./index";
import bcrypt from "bcrypt";
import { hashPassword } from "../services/user";

export enum UserRole {
  MANAGER = "MANAGER",
  USER = "USER",
  ADMIN = "ADMIN",
}

const Schema = mongoose.Schema;

export interface IUser extends BaseSchema {
  email: string;
  active: boolean;
  password: string;
  blocked: boolean;
  role: UserRole;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    active: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    password: { type: String },
    role: { type: String, enum: UserRole, default: UserRole.USER },
  },
  { timestamps: true }
);

// save hashed password
UserSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await hashPassword(this.password);
  }
  next();
});

export default mongoose.model<IUser>("user", UserSchema);
