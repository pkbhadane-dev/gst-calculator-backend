import express from "express";
import { userLogin, userRegister } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/api/v1/user/register", userRegister);
userRouter.post("/api/v1/user/login", userLogin);
