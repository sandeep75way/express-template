import mongoose from "mongoose";
import { hashPassword } from "./user.service";
import { type IUser, UserRole } from "./user.dto";
const Schema = mongoose.Schema;

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    dob: { type: Date, required: true },
    phone: { type: String, required: true },
    image: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
    address: { type: String, required: true },
    active: { type: Boolean, default: true },
    role: { type: String, enum: UserRole },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await hashPassword(this.password);
  }
  next();
});

export default mongoose.model<IUser>("user", UserSchema);
