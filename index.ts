import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import http from "http";

import errorHandler from "./app/middleware/errorHandler";
import { initDB } from "./app/services/initDB";
import usersRoutes from "./app/routes/users";
import adminRoutes from "./app/routes/admin";
import { initPassport } from "./app/services/passport-jwt";
import { loadConfig } from "./app/helper/config";
import { roleAuth } from "./app/middleware/roleAuth";
import { UserRole } from "./app/schema/User";
import { IUser } from "./app/schema/User";

loadConfig();

declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> {}
    interface Request {
      user?: User;
    }
  }
}

const port = Number(process.env.PORT) ?? 5000;

const app: Express = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));

const initApp = async (): Promise<void> => {
  // init mongodb
  await initDB();

  // passport init
  initPassport();

  // set base path to /api
  app.use("/api", router);

  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });

  // routes
  router.use("/users", usersRoutes);
  router.use("/admin", roleAuth(UserRole.ADMIN, ["/register"]), adminRoutes);

  // error handler
  app.use(errorHandler);
  http.createServer(app).listen(port);
};

void initApp();
