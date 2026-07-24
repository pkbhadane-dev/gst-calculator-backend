import express from "express";
import {
  getUser,
  refreshAccessToken,
  userLogin,
  userRegister,
} from "../controllers/user.controller.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.post("/auth/refresh-token", refreshAccessToken);
userRouter.get("/getUser", verifyJwtToken, getUser);

export default userRouter;
