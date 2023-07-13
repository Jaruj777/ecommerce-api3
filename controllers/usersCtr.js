import User from "../model/User.js";
import bcrypt from "bcryptjs"; /*библиотека для хешування коду*/
import asyncHandler from "express-async-handler"; /*асинхронний обработчик ошыбок*/
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromheadr.js";
import { verifyToken } from "../utils/verifyToken.js";

//Пакет для відлвлювання любих асинхронних помилок

//@desc Register user"
//@route POST /api/v1/users/register
//access Private/Admin
export const registerUserCtr = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  //Check user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    //throw
    throw new Error("User already exists");
  }
  //hash password Хешируём пароль для безпеки за допомогою пакета bcryptjs
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //create the user
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });
  res.status(201).json({
    status: "success",
    message: "User Registered Successfully",
    data: user,
  });
});

//@desc Login user"
//@route POST /api/v1/users/login
//access Public
export const loginUserCtr = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Find the user in db by email only
  const userFound = await User.findOne({ email });

  // Якщо email існує то ми також повинні якось провірити пароль, і є метод для порівняння Хеша
  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    res.json({
      status: "success",
      message: "User logged is successfully",
      userFound,
      token: generateToken(userFound?._id),
    });
  } else {
    throw new Error("Invalid login credentials");
  }
});

//Get user profile
//@route GET /api/v1/users/profile
//access private
export const getUserProfileCtr = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userAuthId).populate("orders");
  res.json({
    status: "success",
    message: "User profile fetched succefully",
    user,
  });
});

//@descUpdate user shipping address"
//@route PUT /api/v1/users/updata/shipping
//access Private

export const updateSchippingAddressCtr = asyncHandler(async (req, res) => {
  const { firstName, lastName, addres, postalCode, city, province, phone } =
    req.body;
  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstName,
        lastName,
        addres,
        postalCode,
        city,
        province,
        phone,
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    }
  );
  //send response
  res.json({
    status: "success",
    message: "Use shipping address updated succcessfully",
    user,
  });
});
