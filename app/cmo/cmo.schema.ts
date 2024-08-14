import { Schema, model, type Types } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface ICMO extends BaseSchema {
  user: Types.ObjectId;
}

const CMOSchema = new Schema<ICMO>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default model<ICMO>("CMO", CMOSchema);
