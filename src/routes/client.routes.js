import express from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import { addClient, getAllClients } from "../controllers/client.controller.js";

const clientRouter = express.Router();

clientRouter.post("/addClient", verifyJwtToken, addClient);
clientRouter.get("/getAllClients", verifyJwtToken, getAllClients);

export default clientRouter;
