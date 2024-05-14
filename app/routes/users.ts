import { hashPassword } from "./../services/user";
import createHttpError from "http-errors";
import express from "express";
import passport from "passport";
import { type IUser } from "../schema/User";
import expressAsyncHandler from "express-async-handler";
import { createResponse } from "../helper/response";
import { catchError, validate } from "../middleware/validation";
import { createUserTokens, decodeToken } from "../services/passport-jwt";
import * as userService from "../services/user";

const router = express.Router();

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  validate("users:login"),
  catchError,
  expressAsyncHandler(async (req, res, next) => {
    res.send(
      createResponse({ ...createUserTokens(req.user!), user: req.user })
    );
  })
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validate("users:update"),
  catchError,
  expressAsyncHandler(async (req, res) => {
    const user = req.params.id;
    const result = await userService.updateUser(user, req.body);
    res.send(createResponse(user, "User updated successfully!"));
  })
);

router.post(
  "/register",
  validate("users:create"),
  catchError,
  expressAsyncHandler(async (req, res) => {
    const { email, password, role } = req.body as IUser;
    const user = await userService.createUser({ email, password, role });
    res.send(createResponse(user, "User created successfully!"));
  })
);

router.post(
  "/register-with-link",
  validate("users:create-with-link"),
  catchError,
  expressAsyncHandler(async (req, res) => {
    const { email, role } = req.body as IUser;
    const user = await userService.createUserWithResetPasswordLink({
      email,
      role,
    });
    res.send(createResponse(user, "Reset password link sent successfully!"));
  })
);

router.post(
  "/set-new-password/:token",
  validate("users:set-new-password"),
  catchError,
  expressAsyncHandler(async (req, res) => {
    const { password } = req.body as IUser;
    const decode = decodeToken(req.params.token);
    if (!decode || !decode._id) {
      throw createHttpError(400, { message: "Invalid token" });
    }
    const existUser = await userService.getUserById(decode._id);

    if (!existUser) {
      throw createHttpError(400, {
        message: "User not found",
      });
    }

    if (existUser?.password) {
      throw createHttpError(400, {
        message: "Password already updated for this user",
      });
    }
    const user = await userService.updateUser(decode._id, {
      active: true,
      password: await hashPassword(password),
    });
    res.send(createResponse(user, "Password updated successfully!"));
  })
);

export default router;
