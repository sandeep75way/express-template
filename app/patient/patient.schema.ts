import { Schema, type Types } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface IPatient extends BaseSchema {
  userId: Types.ObjectId;
  doctor: Types.ObjectId;
}

const PatientSchema = new Schema<IPatient>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default PatientSchema;
