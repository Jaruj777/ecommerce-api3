import express from "express";
import {
  createBrandCtr,
  deleteBrandCtr,
  getAllBrandsCtr,
  getSingleBrandCtr,
  updateBrandCtr,
} from "../controllers/brandCtr.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const brandsRoute = express.Router();

brandsRoute.post("/", isLoggedIn, createBrandCtr);
brandsRoute.get("/", getAllBrandsCtr);
brandsRoute.get("/:id", getSingleBrandCtr);
brandsRoute.put("/:id", isLoggedIn, isAdmin, updateBrandCtr);
brandsRoute.delete("/:id", isLoggedIn, isAdmin, deleteBrandCtr);

export default brandsRoute;
//https://ecommerce-api-hxk5.onrender.com
