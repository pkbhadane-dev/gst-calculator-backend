import { User } from "../models/User";
import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validationBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(500, "Something went wrong while generating token");
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
    throw new apiError(500, "User does not exist");
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
    secure: true,
    sameSite: "none",
  };

  res
    .status(201)
    .cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(201, loggedInUser, "User login successfully"));
});
