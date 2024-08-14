import { hashPassword } from "./user.service";
import createHttpError from "http-errors";
import express from "express";
import passport from "passport";
import expressAsyncHandler from "express-async-handler";
import { createResponse } from "../common/helper/response.hepler";
import { catchError } from "../common/middleware/cath-error.middleware";
import {
  createUserTokens,
  decodeToken,
} from "../common/services/passport-jwt.service";
import * as userService from "./user.service";
import {
  createUser,
  createUserWithLink,
  password,
  userLogin,
  userUpdate,
} from "./user.validation";

import { type IUser } from "./user.dto";

const router = express.Router();

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  userLogin,
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
  userUpdate,
  catchError,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await userService.updateUser(userId, req.body);
    res.send(createResponse(user, "User updated successfully!"));
  })
);

router.post(
  "/register",
  createUser,
  catchError,
  expressAsyncHandler(async (req, res) => {
    const { email, password, role } = req.body as IUser;
    const user = await userService.createUser({ email, password, role });
    res.send(createResponse(user, "User created successfully!"));
  })
);

router.post(
  "/register-with-link",
  createUserWithLink,
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
  password,
  catchError,
  expressAsyncHandler(async (req, res) => {
    const { password } = req.body as IUser;
    const decode = decodeToken(req.params.token);
    if (!decode?._id) {
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
