import express from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import { createInvoice } from "../controllers/invoice.controller.js";

const invoiceRouter = express.Router();

invoiceRouter.post(
  "/createInvoice",
  verifyJwtToken,
  createInvoice,
);

export default invoiceRouter;
