import express from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
} from "../controllers/invoice.controller.js";

const invoiceRouter = express.Router();

invoiceRouter.post("/createInvoice", verifyJwtToken, createInvoice);

invoiceRouter.get("/get-allInvoices", verifyJwtToken, getAllInvoices);
invoiceRouter.get("/:invoiceId", verifyJwtToken, getInvoiceById);

export default invoiceRouter;
