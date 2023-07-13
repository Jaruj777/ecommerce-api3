import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createCategoryCtr,
  deleteCategoryCtr,
  getAllCategoriesCtr,
  getSingleCategoryCtr,
  updateCategoryCtr,
} from "../controllers/categoryCtr.js";
import uploadCategoryFile from "../config/fileUploadCat.js";
import isAdmin from "../middlewares/isAdmin.js";

const categoriesRoute = express.Router();

categoriesRoute.post(
  "/",
  isLoggedIn,
  isAdmin,
  uploadCategoryFile.single("file"),
  createCategoryCtr
);
categoriesRoute.get("/", getAllCategoriesCtr);
categoriesRoute.get("/:id", getSingleCategoryCtr);
categoriesRoute.put("/:id", isAdmin, isLoggedIn, updateCategoryCtr);
categoriesRoute.delete("/:id", isAdmin, isLoggedIn, deleteCategoryCtr);

export default categoriesRoute;
