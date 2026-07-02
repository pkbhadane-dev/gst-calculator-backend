import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";

export const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected", connectionInstance.connection.host);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
