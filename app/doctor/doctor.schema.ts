import { Schema, type Types, model } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface IDoctor extends BaseSchema {
  userId: Types.ObjectId;
  patients: Types.ObjectId[];
  assignedNurse: Types.ObjectId;
  assignedNPPA: Types.ObjectId;
  managedBy: Types.ObjectId;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    patients: [{ type: Schema.Types.ObjectId, ref: "Patient" }],
    assignedNurse: { type: Schema.Types.ObjectId, ref: "User" },
    assignedNPPA: { type: Schema.Types.ObjectId, ref: "User" },
    managedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model<IDoctor>("Doctor", DoctorSchema);
