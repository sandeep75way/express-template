import Parent, { ParentRelation } from "../schema/Parent";
import Student from "../schema/Student";
import { UserRole } from "../schema/User";
import { createUser } from "./user";

export const createParentsToStudent = async (params: {
  parents: Array<{
    email: string;
    password: string;
    name: string;
    phone: string;
    relation: ParentRelation;
  }>;
  studentId: string;
}) => {
  const { parents, studentId } = params;
  const premisses = parents.map(async (parent) => {
    const { email, password, relation, phone, name } = parent;
    const user = await createUser({
      email,
      role: UserRole.PARENT,
    });
    const result = await Parent.create({
      email,
      phone,
      name,
      user: user.id,
      relation,
    });
    return result;
  });
  const results = await Promise.all(premisses);
  const student = await Student.findByIdAndUpdate(
    studentId,
    { $push: { parents: results.map((item) => item._id) } },
    { new: true }
  );
  return { parents: results, student };
};
