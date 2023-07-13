import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";
import Colors from "../model/Colors.js";

//@desc Create new Color
//@route POST/api/v1/colors
//@access Private/Admin;
export const createColorsdCtr = asyncHandler(async (req, res) => {
  const { name } = req.body;

  //colors exists
  const colorsFound = await Colors.findOne({ name });
  if (colorsFound) {
    throw new Error("Colors already exists");
  }
  //create color
  const colors = await Colors.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });
  res.json({
    status: "success",
    message: "Colors created successfully",
    colors,
  });
});

//@desc Get all colors
//@route GET/api/v1/colors
//@access Public;
export const getAllColorsCtr = asyncHandler(async (req, res) => {
  const colors = await Colors.find();
  res.json({
    status: "success",
    message: "Colors fetched successfully",
    colors,
  });
});

//@desc Get single colors
//@route GET/api/v1/colors/:id
//@access Public;
export const getSingleColorCtr = asyncHandler(async (req, res) => {
  const color = await Colors.findById(req.params.id);
  res.json({
    status: "success",
    message: "Color fetched successfully",
    color,
  });
});

//@desc update color
//@route PUT/api/v1/colors/:id
//@access Private/Admin
export const updateColorCtr = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //update
  const color = await Colors.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  res.json({
    status: "success",
    message: "Color updated successfully",
    color,
  });
});

//@desc delete color
//@route DELETE/api/v1/colors/:id/delete
//@access Private/Admin
export const deleteColorCtr = asyncHandler(async (req, res) => {
  const color = await Colors.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Color deleted successfully",
  });
});
