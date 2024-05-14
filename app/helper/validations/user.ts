import { check } from "express-validator";
import User, { UserRole } from "../../schema/User";

export const userLogin = [
  check("email")
    .exists({ values: "falsy" })
    .notEmpty()
    .bail()
    .withMessage("Email is required")
    .isEmail()
    .bail()
    .withMessage("Enter valid email"),
  check("password")
    .exists({ values: "falsy" })
    .notEmpty()
    .bail()
    .withMessage("Password is required"),
];

export const userUpdate = [check("active").optional().isBoolean()];

export const password = check("password")
  .exists()
  .bail()
  .withMessage("Password is required")
  .notEmpty()
  .bail()
  .withMessage("Password is required")
  .isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .bail()
  .withMessage("Enter strong password");

export const createUser = [
  check("email")
    .exists()
    .notEmpty()
    .bail()
    .withMessage("Email is required")
    .isEmail()
    .bail()
    .withMessage("Enter valid email")
    .custom(async (value: string, { req }) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already registered");
      }
      return true;
    }),
  password,
  check("role")
    .exists()
    .bail()
    .withMessage("Role is required")
    .notEmpty()
    .bail()
    .withMessage("Role is required")
    .isIn(Object.values(UserRole)),
];

export const createUserWithLink = [
  check("email")
    .exists()
    .notEmpty()
    .bail()
    .withMessage("Email is required")
    .isEmail()
    .bail()
    .withMessage("Enter valid email")
    .custom(async (value: string, { req }) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already registered");
      }
      return true;
    }),

  check("role")
    .exists()
    .bail()
    .withMessage("Role is required")
    .notEmpty()
    .bail()
    .withMessage("Role is required")
    .isIn(Object.values(UserRole)),
];
