import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import User from "../model/User.js";
import Order from "../model/Order.js";
import Product from "../model/Product.js";
import dotenv from "dotenv";
import Coupon from "../model/Coupon.js";

dotenv.config();
//@desc Create orders
//@route POST/api/v1/orders
//@access Private/Admin;

//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtr = asyncHandler(async (req, res) => {
  //get then coupon
  const { coupon } = req?.query;
  const couponFound = await Coupon.findOne({
    code: coupon?.toUpperCase(),
  });

  if (couponFound?.isExpired) {
    throw new Error("Coupon has expired");
  }
  if (!couponFound) {
    throw new Error("Coupon dous exist");
  }

  //get discount
  const discount = couponFound?.discount / 100;

  const { orderItems, shippingAddress, totalPrice } = req.body;
  //Find user
  const user = await User.findById(req.userAuthId);
  //мы собираемся проверить в этом месте, чтобы проверить, есть ли у пользователя adress
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }
  //проверим Если заказ не пустой.
  if (orderItems?.length <= 0) {
    throw new Error("No Order Items");
  }
  //Затем после этого мы собираемся разместить заказ или создать заказ и сохранить его в базе данных.
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
  });

  //Так вот, после оформления заказа мы хотим обновить товар. умен кол товара и увел кол прод товара
  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (order) => {
    const product = products?.find(
      (pr) => pr?._id?.toString() === order?._id?.toString()
    );
    if (product) {
      product.totalSold += order.qty;
      // product.totalQty -= order.qty;
    }
    await product.save();
  });
  //push order into user
  user.orders.push(order?._id);
  await user.save();

  //после размещения заказа, мы собираемся произвести фактическую оплату[stripe)
  //convert order items to have same structure that stripe need
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "http://localhost:300/success",
    cancel_url: "http://localhost:300/cancel",
  });
  res.send({ url: session.url });
});

//@desc get all orders
//@route GET/api/v1/orders
//@access Private;
export const getAllOrdersCtr = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});

//@desc get single order
//@route GET/api/v1/orders/:id
//@access Private/Admin;
export const getSingleOrderCtr = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  const order = await Order.findById(id);
  res.status(200).json({
    success: true,
    message: "Single order",
    order,
  });
});

//@desc update order to delivered
//@route PUT/api/v1/orders/update/:id
//@access Private/Admin;
export const updateOrderCtr = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  //update
  const updateOrder = await Order.findByIdAndUpdate(
    id,
    { status: req.body.status },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Order updated",
    updateOrder,
  });
});
//@desc sales sum of orders
//@rout GET/api/v1/orders/sales/sum
//@access Private/Admin;
export const getOrderStatsCtr = asyncHandler(async (req, res) => {
  //get order stats
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
        minSale: {
          $min: "$totalPrice",
        },
        maxSale: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);
  //get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  //send response
  res.status(200).json({
    success: true,
    message: "Sum of orders",
    orders,
    saleToday,
  });
});
