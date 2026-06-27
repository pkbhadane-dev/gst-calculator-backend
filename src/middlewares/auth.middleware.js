import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

export const verifyJwtToken = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new apiError(401, "Unauthorized request");
    }

    const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = verifiedToken;
    next();
  } catch (error) {
    console.log(error.message || "invalid token");
    throw new apiError(401, error.message || "invalid token");
  }
});
