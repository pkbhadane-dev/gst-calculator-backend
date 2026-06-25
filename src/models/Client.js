import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    gstin: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  { timestamps: true },
);

export const Client = mongoose.model("Client", clientSchema);
