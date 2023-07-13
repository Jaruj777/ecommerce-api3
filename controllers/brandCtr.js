import asyncHandler from "express-async-handler";

import Brand from "../model/Brand.js";

//@desc Create new Brand
//@route POST/api/v1/brands
//@access Private/Admin;
export const createBrandCtr = asyncHandler(async (req, res) => {
  const { name } = req.body;

  //brand exists
  const brandFound = await Brand.findOne({ name });
  if (brandFound) {
    throw new Error("Brand already exists");
  }
  //create brand
  const brand = await Brand.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });
  res.json({
    status: "success",
    message: "Brand created successfully",
    brand,
  });
});

//@desc Get all brands
//@route GET/api/v1/brands
//@access Public;
export const getAllBrandsCtr = asyncHandler(async (req, res) => {
  const brands = await Brand.find();
  res.json({
    status: "success",
    message: "Brands fetched successfully",
    brands,
  });
});

//@desc Get single brand
//@route GET/api/v1/brands/:id
//@access Public;
export const getSingleBrandCtr = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  res.json({
    status: "success",
    message: "Brand fetched successfully",
    brand,
  });
});

//@desc update brand
//@route PUT/api/v1/brands/:id/update
//@access Private/Admin
export const updateBrandCtr = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //update
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  res.json({
    status: "success",
    message: "Brand updated successfully",
    brand,
  });
});

//@desc delete brand
//@route DELETE/api/v1/brands/:id/delete
//@access Private/Admin
export const deleteBrandCtr = asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Brand deleted successfully",
  });
});
