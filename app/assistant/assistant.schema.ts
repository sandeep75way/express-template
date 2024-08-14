import { Schema, type Types, model } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface IAssistant extends BaseSchema {
  user: Types.ObjectId;
  doctor: Types.ObjectId;
  patients: Types.ObjectId[];
}

const AssistantSchema = new Schema<IAssistant>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
  },
  { timestamps: true }
);

export default model<IAssistant>("Assistant", AssistantSchema);
