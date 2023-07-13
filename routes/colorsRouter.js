import express from "express";
import {
  createColorsdCtr,
  getAllColorsCtr,
  getSingleColorCtr,
  updateColorCtr,
  deleteColorCtr,
} from "../controllers/colorsCtr.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const colorsRoute = express.Router();

colorsRoute.post("/", isLoggedIn, isAdmin, createColorsdCtr);
colorsRoute.get("/", getAllColorsCtr);
colorsRoute.get("/:id", getSingleColorCtr);
colorsRoute.put("/:id", isLoggedIn, isAdmin, updateColorCtr);
colorsRoute.delete("/:id", isLoggedIn, isAdmin, deleteColorCtr);

export default colorsRoute;
