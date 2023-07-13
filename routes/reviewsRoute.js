import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createReviewsCtr } from "../controllers/reviewsCtr.js";

const reviewsRoute = express.Router();

reviewsRoute.post("/:productID", isLoggedIn, createReviewsCtr);

export default reviewsRoute;
