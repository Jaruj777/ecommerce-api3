import express from "express";
import {
  createProductCtr,
  deleteProductCtr,
  getProductByIdCtr,
  getProductCtr,
  updateProductCtr,
} from "../controllers/productsCtr.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import upload from "../config/fileUpload.js";
import isAdmin from "../middlewares/isAdmin.js";

const productRoutes = express.Router();

productRoutes.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.array("files"),
  createProductCtr
);
productRoutes.get("/", getProductCtr);
productRoutes.get("/:id", getProductByIdCtr);
productRoutes.put("/:id", isLoggedIn, isAdmin, updateProductCtr);
productRoutes.delete("/:id", isLoggedIn, isAdmin, deleteProductCtr);

export default productRoutes;
