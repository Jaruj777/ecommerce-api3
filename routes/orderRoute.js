import express from "express";
import {
  createOrderCtr,
  getAllOrdersCtr,
  getOrderStatsCtr,
  getSingleOrderCtr,
  updateOrderCtr,
} from "../controllers/orderCtr.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const orderRoute = express.Router();

orderRoute.post("/", isLoggedIn, createOrderCtr);
orderRoute.get("/", isLoggedIn, getAllOrdersCtr);
orderRoute.get("/sales/sum", isLoggedIn, getOrderStatsCtr);
orderRoute.get("/:id", isLoggedIn, getSingleOrderCtr);
orderRoute.put("/update/:id", isLoggedIn, updateOrderCtr);

export default orderRoute;
