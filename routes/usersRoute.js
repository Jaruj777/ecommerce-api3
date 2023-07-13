import express from "express";
import {
  getUserProfileCtr,
  loginUserCtr,
  registerUserCtr,
  updateSchippingAddressCtr,
} from "../controllers/usersCtr.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUserCtr);
userRoutes.post("/login", loginUserCtr);
userRoutes.get("/profile", isLoggedIn, getUserProfileCtr);
userRoutes.put("/update/shipping", isLoggedIn, updateSchippingAddressCtr);

export default userRoutes;
