import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createCouponCtr,
  deleteCouponCtr,
  getAllCouponsCtr,
  getCouponCtr,
  updateCouponCtr,
} from "../controllers/cuponsCtr.js";
import isAdmin from "../middlewares/isAdmin.js";

const couponsRoute = express.Router();

couponsRoute.post("/", isLoggedIn, isAdmin, createCouponCtr);
couponsRoute.get("/", isLoggedIn, getAllCouponsCtr);
couponsRoute.get("/:id", isLoggedIn, getCouponCtr);
couponsRoute.put("/:id", isLoggedIn, isAdmin, updateCouponCtr);
couponsRoute.delete("/:id", isLoggedIn, isAdmin, deleteCouponCtr);

export default couponsRoute;
