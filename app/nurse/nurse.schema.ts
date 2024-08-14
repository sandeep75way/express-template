import { Schema, type Types, model } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface INurse extends BaseSchema {
  userId: Types.ObjectId;
  doctor: Types.ObjectId;
}

const NurseSchema = new Schema<INurse>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
  },
  { timestamps: true }
);

export default model<INurse>("Nurse", NurseSchema);
