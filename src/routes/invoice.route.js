import express from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware";
import { createInvoice } from "../controllers/invoice.controller";

const invoiceRouter = express.Router();

invoiceRouter.post(
  "/api/v1/invoice/createInvoice",
  verifyJwtToken,
  createInvoice,
);
