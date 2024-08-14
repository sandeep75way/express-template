import { type BaseSchema } from "../common/dto/base.dto";

export enum UserRole {
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  ASSISTANT = "ASSISTANT",
  NURSE = "NURSE",
  CONCIERGE = "CONCIERGE",
  CARE_TRANSITION_COORDINATOR = "CTC",
  CHIEF_MEDICAL_OFFICER = "CMO",
  HUMANITY_RELATIONSHIP_MANAGER = "HRM",
}

export interface IUser extends BaseSchema {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  gender: string;
  password: string;
  isEmailVerified: boolean;
  dob: Date;
  phone: string;
  image?: string;
  isDeleted: boolean;
  address: string;
  role: UserRole;
  active: boolean;
}
