import { User } from "../models/User.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validationBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(400, "Something went wrong while generating token");
  }
};

export const userRegister = asyncHandler(async (req, res) => {
  const { businessName, email, password, gstin, address, state } = req.body;

  if (!businessName || !email || !password || !gstin || !address || !state) {
    throw new apiError(400, "All fields are required");
  }

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new apiError(409, "User already exist");
  }

  const user = await User.create({
    businessName,
    email,
    password,
    gstin,
    address,
    state,
  });

  const filterUserData = user.toObject();
  delete filterUserData.password;

  return res
    .status(200)
    .json(new apiResponse(201, filterUserData, "User created successfully"));
});

export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new apiError(401, "All fields are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(404, "User does not exist");
  }

  const verifyPassword = await user.isPasswordCorrect(password);

  if (!verifyPassword) {
    throw new apiError(401, "Incorrect credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(user);

  const loggedInUser = user.toObject();
  delete loggedInUser.password;

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json(
      new apiResponse(
        201,
        { loggedInUser, accessToken, refreshToken },
        "User login successfully",
      ),
    );
});

export const getUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  if (!userId) {
    throw new apiError(404, "User Not Found");
  }

  const user = await User.findById(userId).select("-password");
  console.log("user", user);

  return res
    .status(200)
    .json(new apiResponse(200, user, "User get successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    throw new apiError(404, "refresh token not found");
  }

  const verifiedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const userId = verifiedToken._id;

  const user = await User.findById(userId).select("-password");

  if (token !== user.refreshToken) {
    throw new apiError(401, "Refresh token expire");
  }

  const { refreshToken, accessToken } = generateAccessAndRefreshToken(user);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        { refreshToken, accessToken },
        "token generated successfully",
      ),
    );
});
