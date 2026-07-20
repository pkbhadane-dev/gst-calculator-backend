import { Client } from "../models/Client.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addClient = asyncHandler(async (req, res) => {
  const { clientName, email, phone, gstin, address, state } = req.body;
  const userId = req.user?._id;

  if (!clientName || !phone || !gstin || !state) {
    throw new apiError(401, "All fields are required");
  }

  const client = await Client.create({
    clientName,
    email,
    phone,
    gstin,
    address,
    state,
    userId,
  });

  res
    .status(201)
    .json(new apiResponse(201, client, "Client successfully added"));
});

export const getAllClients = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const allClients = await Client.find({ userId });

  res
    .status(201)
    .json(new apiResponse(201, allClients, "All clients are fetched"));
});
