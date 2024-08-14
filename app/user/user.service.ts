import bcrypt from "bcrypt";
import {
  resetPasswordEmailTemplate,
  sendEmail,
} from "../common/services/email.service";
import { createUserTokens } from "../common/services/passport-jwt.service";
import { type IUser, type UserRole } from "./user.dto";
import User from "./user.schema";

export const createUserWithResetPasswordLink = async (data: {
  email: string;
  role: UserRole;
}) => {
  await User.create(data);
  const user = await getUserByEmail(data.email);
  const { accessToken } = createUserTokens(user!);
  await sendEmail({
    to: user!.email,
    subject: "Reset password",
    html: resetPasswordEmailTemplate(accessToken),
  });
  return user;
};

export const createUser = async (data: {
  email: string;
  role: UserRole;
  password: string;
}) => {
  const user = await User.create({ ...data, active: true });
  return user;
};

export const updateUser = async (userId: string, data: Partial<IUser>) => {
  const user = await User.findOneAndUpdate({ _id: userId }, data, {
    new: true,
    projection: "-password",
  });
  return user;
};

export const deleteUser = async (userId: string) => {
  const user = await User.deleteOne({ _id: userId });
  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email }).lean();
  return user;
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id).lean();
  return user;
};

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
};
