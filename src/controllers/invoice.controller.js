import { User } from "../models/User.js";
import { Client } from "../models/Client.js";
import { Invoice } from "../models/Invoice.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import mongoose from "mongoose";

export const createInvoice = asyncHandler(async (req, res) => {
  const { invoiceNumber, clientId, items } = req.body;
  const userId = req.user?._id;

  if (
    !invoiceNumber ||
    !clientId ||
    !items ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    throw new apiError(400, "All fields are required");
  }

  if (!userId) {
    throw new apiError(401, "User not authenticated");
  }

  const user = await User.findById(userId);
  const client = await Client.findById(clientId);

  if (!client) {
    throw new apiError(404, "Client not found");
  }

  let baseAmount = 0;
  let totalGst = 0;

  items?.forEach((item) => {
    const itemBaseAmount = item.quantity * item.price;
    const itemGst = (itemBaseAmount * item.gstRate) / 100;

    baseAmount += itemBaseAmount;
    totalGst += itemGst;
  });

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (user?.state.toLowerCase() === client?.state.toLowerCase()) {
    cgst = totalGst / 2;
    sgst = totalGst / 2;
  } else {
    igst = totalGst;
  }

  const grandTotal = baseAmount + totalGst;

  const invoice = await Invoice.create({
    invoiceNumber,
    clientId,
    userId,
    items,
    baseAmount,
    cgst,
    sgst,
    igst,
    totalGst,
    grandTotal,
  });

  return res
    .status(201)
    .json(new apiResponse(201, invoice, "Invoice created successfully"));
});

export const getAllInvoices = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new apiError(401, "User not authenticated");
  }

  const allInvoices = await Invoice.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "clients",
        localField: "clientId",
        foreignField: "_id",
        as: "clientDetail",
        pipeline: [
          {
            $project: {
              clientName: 1,
              state: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        client: {
          $first: "$clientDetail",
        },
      },
    },
    {
      $unset:"clientDetail"
    }
  ]);

  console.log("allInvoices", allInvoices);

  res
    .status(200)
    .json(
      new apiResponse(200, allInvoices, "All invoices fetched successfully"),
    );
});
