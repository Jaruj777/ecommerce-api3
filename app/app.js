import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/usersRoute.js";
import {
  globalErrHandler,
  notFoundHandler,
} from "../middlewares/globalErrHandler.js";
import productRoutes from "../routes/productsRoute.js";
import categoriesRoute from "../routes/categoriesRoute.js";
import brandsRoute from "../routes/brandsRoute.js";
import colorsRoute from "../routes/colorsRouter.js";
import reviewsRoute from "../routes/reviewsRoute.js";
import orderRoute from "../routes/orderRoute.js";
import Order from "../model/Order.js";
import couponsRoute from "../routes/couponsRoute.js";

dotenv.config();

//DB Connect
dbConnect();

const app = express();
//Stripe Web-hook

// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_23907a6c60eb93ff4594ac0184dbb142043e8acbfcd2caeb002575af97d09fdc";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("event");
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      //update the order
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;
      //find order
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentStatus,
          paymentMethod,
        },
        { new: true }
      );

      console.log(order);
    } else {
      return;
    }

    // Handle the event
    // switch (event.type) {
    //   case "payment_intent.succeeded":
    //     const paymentIntentSucceeded = event.data.object;
    //     // Then define and call a function to handle the event payment_intent.succeeded
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

//передавать входящие данные format
app.use(express.json());

//routes
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productRoutes);
app.use("/api/v1/categories/", categoriesRoute);
app.use("/api/v1/brands/", brandsRoute);
app.use("/api/v1/colors/", colorsRoute);
app.use("/api/v1/reviews/", reviewsRoute);
app.use("/api/v1/orders/", orderRoute);
app.use("/api/v1/coupons/", couponsRoute);

//err midleware
app.use(notFoundHandler);
app.use(
  globalErrHandler
); /* должен быить в самом низу после роутов чтоюы отлавлевать все */

export default app;
