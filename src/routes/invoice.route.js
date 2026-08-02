import express from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import {
  createInvoice,
  getAllInvoices,
} from "../controllers/invoice.controller.js";

const invoiceRouter = express.Router();

invoiceRouter.post("/createInvoice", verifyJwtToken, createInvoice);

invoiceRouter.get("/get-allInvoices", verifyJwtToken, getAllInvoices);

export default invoiceRouter;
