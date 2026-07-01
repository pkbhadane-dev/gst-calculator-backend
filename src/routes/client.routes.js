import express from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware";
import { addClient, getAllClients } from "../controllers/client.controller";

const clientRouter = express.Router();

clientRouter.post("/api/v1/client/addClient", verifyJwtToken, addClient);
clientRouter.get("/api/v1/client/getAllClients", verifyJwtToken, getAllClients);
