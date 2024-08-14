import { Schema, type Document, model, type Types } from "mongoose";

export interface IAppointment extends Document {
  date: Date;
  startTime: string;
  endTime: string;
  amount: number;
  doctor: Types.ObjectId;
  nurse: Types.ObjectId;
  patient: Types.ObjectId;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    amount: { type: Number, required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    nurse: { type: Schema.Types.ObjectId, ref: "Nurse", required: false },
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  },
  { timestamps: true }
);

export default model<IAppointment>("Appointment", AppointmentSchema);
