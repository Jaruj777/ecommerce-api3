import asyncHandler from "express-async-handler";
import Review from "../model/Review.js";
import Product from "../model/Product.js";

//@desc Create new review
//@route POST/api/v1/reviews
//@access Private/Admin;
export const createReviewsCtr = asyncHandler(async (req, res) => {
  const { message, rating } = req.body;
  //find the product
  const { productID } = req.params;
  const productFound = await Product.findById(productID).populate("reviews");
  if (!productFound) {
    throw new Error("Product Not Found");
  }
  //Если пользователь уже cделал обзор этого продукта.
  const hasReviewd = productFound?.reviews?.find(
    (review) => review?.user.toString() === req.userAuthId.toString()
  );
  if (hasReviewd) {
    throw new Error("You have already reviewed this product");
  }
  //Итак, продолжим создание обзора.
  const review = await Review.create({
    message,
    rating,
    user: req.userAuthId,
    product: productFound._id,
  });
  //Push review into  product Found
  productFound.reviews.push(review?._id);
  //resave
  await productFound.save();
  res.status(201).json({
    success: true,
    message: "Review created successfully",
  });
});
