import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: Number,
    unique: true,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  items: [
    {
      itemName: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      gstRate: {
        type: Number,
        required: true,
      },
    },
  ],
  baseAmount: {
    type: Number,
    required: true,
  },
  cgst: {
    type: Number,
    required: true,
  },
  sgst: {
    type: Number,
    required: true,
  },
  igst: {
    type: Number,
    required: true,
  },
  totalGst: {
    type: Number,
    required: true,
  },
  grandTotal: {
    type: Number,
    required: true,
  },
});

export const Invoice = mongoose.model("Invoice", invoiceSchema);
