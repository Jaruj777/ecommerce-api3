import asyncHandler from "express-async-handler";
import Coupon from "../model/Coupon.js";

//@desc Create cupon
//@route POST/api/v1/cupons
//@access Private/Admin;
export const createCouponCtr = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  //check  if admin
  //check if cupon already exists
  const codeExists = await Coupon.findOne({
    code,
  });
  if (codeExists) {
    throw new Error("Coupon already exists");
  }
  //check if diskount is anumber
  if (isNaN(discount)) {
    throw new Error("Diskount value must be a number ");
  }

  //create coupon
  const coupon = await Coupon.create({
    startDate,
    endDate,
    code: code?.toUpperCase(),
    discount,
    user: req.userAuthId,
  });
  //send the response
  res.status(201).json({
    status: "success",
    message: "Coupon created successfully",
    coupon,
  });
});
//@desc qet all coupons
//@route Get/api/v1/coupons
//@access Private/Admin;
export const getAllCouponsCtr = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    status: "success",
    message: "All coupons",
    coupons,
  });
});
//@desc qet single coupon
//@route Get/api/v1/coupons/:id
//@access Private/Admin;
export const getCouponCtr = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  res.json({
    status: "success",
    message: "Coupon fetched",
    coupon,
  });
});

//@desc update coupon
//@route PUT/api/v1/coupons/:id
//@access Private/Admin;
export const updateCouponCtr = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      startDate,
      endDate,
      discount,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    message: "Coupon update succefully",
    coupon,
  });
});

//@desc qet single coupon
//@route DELETE/api/v1/coupons/:id
//@access Private/Admin;
export const deleteCouponCtr = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Coupon delete succefully",
    coupon,
  });
});
