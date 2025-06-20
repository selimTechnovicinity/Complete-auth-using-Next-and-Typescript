import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { authenticateJWT } from "./common/strategies/jwt.strategy";
import { config } from "./config/app.config";
import { HTTPSTATUS } from "./config/http.config";
import connectDatabase from "./database/database";
import { asyncHandler } from "./middlewares/asyncHandler";
import { errorHandler } from "./middlewares/errorHandler";
import passport from "./middlewares/passport";
import authRoutes from "./modules/auth/auth.routes";
import mfaRoutes from "./modules/mfa/mfa.routes";
import sessionRoutes from "./modules/session/session.routes";

const app = express();
const BASE_PATH = config.BASE_PATH;
console.log(process.env.APP_ORIGIN);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.APP_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(passport.initialize());

app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTPSTATUS.OK).json({
      message: "Hello Subscribers!!!",
    });
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);

app.use(`${BASE_PATH}/mfa`, mfaRoutes);

app.use(`${BASE_PATH}/session`, authenticateJWT, sessionRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
